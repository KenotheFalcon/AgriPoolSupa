import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// This function will run every Sunday at midnight.
export const generateWeeklySuggestions = functions.pubsub
  .schedule('every sunday 00:00')
  .onRun(async (context) => {
    console.log('Starting weekly suggestion generation.');

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    try {
      // 1. Fetch completed group buys from the last week
      const groupsSnapshot = await db
        .collection('groupBuys')
        .where('status', '==', 'completed')
        .where('createdAt', '>=', oneWeekAgo)
        .get();

      if (groupsSnapshot.empty) {
        console.log('No completed group buys in the last week. Exiting.');
        return null;
      }

      // 2. Aggregate data by region and produce
      const regionalDemand: { [key: string]: { [key: string]: number } } = {};

      groupsSnapshot.forEach((doc) => {
        const group = doc.data();
        const region = group.pickupLocation.toLowerCase().trim(); // Normalize region
        const produce = group.produceName.toLowerCase().trim(); // Normalize produce name

        if (!regionalDemand[region]) {
          regionalDemand[region] = {};
        }
        if (!regionalDemand[region][produce]) {
          regionalDemand[region][produce] = 0;
        }
        regionalDemand[region][produce] += group.totalQuantity;
      });

      // 3. Generate suggestions for each region
      const suggestions: { [key: string]: string } = {};
      for (const region in regionalDemand) {
        const produceInRegion = regionalDemand[region];
        const topProduce = Object.keys(produceInRegion).sort(
          (a, b) => produceInRegion[b] - produceInRegion[a]
        )[0];

        if (topProduce) {
          const suggestionMessage = `High demand for ${topProduce} in ${region} this week! Consider listing more.`;
          suggestions[region] = suggestionMessage;
          console.log(`Generated suggestion for ${region}: ${suggestionMessage}`);
        }
      }

      // 4. Send notifications to relevant farmers
      const farmersSnapshot = await db.collection('users').where('role', '==', 'farmer').get();
      const farmerIdsByRegion: { [key: string]: string[] } = {};

      // This is a simplified way to target farmers. A better approach would be to store a farmer's primary region.
      // For now, we'll assume we can notify all farmers or farmers who have listed in that region before.

      const notificationPromises: Promise<any>[] = [];
      for (const region in suggestions) {
        const message = suggestions[region];

        farmersSnapshot.forEach((farmerDoc) => {
          const farmer = farmerDoc.data();
          // A simple logic: notify all farmers. Can be refined.
          const notification = {
            userId: farmerDoc.id,
            message,
            isRead: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            link: '/farmers/post',
          };
          notificationPromises.push(db.collection('notifications').add(notification));
        });
      }

      await Promise.all(notificationPromises);
      console.log('Successfully generated and sent all weekly suggestions.');
    } catch (error) {
      console.error('Error generating weekly suggestions:', error);
      return null;
    }

    return null;
  });

// Helper function to get a user's FCM tokens
async function getFCMTokens(userId: string): Promise<string[]> {
  const tokensSnapshot = await db.collection('users').doc(userId).collection('fcmTokens').get();
  if (tokensSnapshot.empty) return [];
  return tokensSnapshot.docs.map((doc) => doc.id);
}

// 1. Trigger when a group buy is nearly full
export const onGroupNearlyFull = functions.firestore
  .document('groupBuys/{groupId}')
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const oldValue = change.before.data();

    const newFunding = newValue.quantityFunded / newValue.totalQuantity;
    const oldFunding = oldValue.quantityFunded / oldValue.totalQuantity;

    // Check if the 90% threshold was crossed
    if (newFunding >= 0.9 && oldFunding < 0.9) {
      const group = newValue;
      const farmerId = group.farmerId;
      const tokens = await getFCMTokens(farmerId);

      if (tokens.length > 0) {
        const payload = {
          notification: {
            title: 'Your Group Buy is Almost Full!',
            body: `Your group for "${group.produceName}" is now 90% funded. Get ready for dispatch!`,
            icon: '/favicon.ico',
            click_action: `/farmers/listings`,
          },
        };
        await admin.messaging().sendToDevice(tokens, payload);
      }
    }
  });

// 2. Trigger on new chat message
export const onNewChatMessage = functions.firestore
  .document('groupBuys/{groupId}/messages/{messageId}')
  .onCreate(async (snap, context) => {
    const message = snap.data();
    const groupId = context.params.groupId;

    const groupDoc = await db.collection('groupBuys').doc(groupId).get();
    if (!groupDoc.exists) return;

    const group = groupDoc.data()!;
    const allParticipantIds = Object.keys(group.participants || {});
    const allRelevantUserIds = [...allParticipantIds, group.farmerId];

    const notificationPromises = allRelevantUserIds
      .filter((id) => id !== message.senderId) // Don't notify the sender
      .map(async (userId) => {
        const tokens = await getFCMTokens(userId);
        if (tokens.length > 0) {
          const payload = {
            notification: {
              title: `New Message in ${group.produceName} Group`,
              body: `${message.senderName} (${message.senderRole}): ${
                message.text || 'Sent a voice message'
              }`,
              icon: '/favicon.ico',
              click_action: `/dashboard?tab=orders`, // Generic link, could be improved
            },
          };
          return admin.messaging().sendToDevice(tokens, payload);
        }
      });

    await Promise.all(notificationPromises);
  });

// 3. Trigger when farmer dispatches produce
export const onProduceDispatched = functions.firestore
  .document('groupBuys/{groupId}')
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const oldValue = change.before.data();

    if (
      newValue.logisticsStatus !== oldValue.logisticsStatus &&
      (newValue.logisticsStatus === 'in_transit' || newValue.logisticsStatus === 'at_pickup')
    ) {
      const group = newValue;
      const participants = Object.keys(group.participants || {});

      const notificationPromises = participants.map(async (userId) => {
        const tokens = await getFCMTokens(userId);
        if (tokens.length > 0) {
          const payload = {
            notification: {
              title: 'Your Order is on its Way!',
              body: `Your order for "${
                group.produceName
              }" has been dispatched by the farmer. Current status: ${newValue.logisticsStatus.replace(
                '_',
                ' '
              )}`,
              icon: '/favicon.ico',
              click_action: `/pickup?orderId=...`, // This needs the specific orderId
            },
          };
          return admin.messaging().sendToDevice(tokens, payload);
        }
      });

      await Promise.all(notificationPromises);
    }
  });
