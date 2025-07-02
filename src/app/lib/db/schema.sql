-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create alerts table with indexes
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('performance', 'error', 'warning')),
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'acknowledged', 'resolved')),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for alerts
CREATE INDEX idx_alerts_type ON alerts(type);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_timestamp ON alerts(timestamp);
CREATE INDEX idx_alerts_resolved_at ON alerts(resolved_at);
CREATE INDEX idx_alerts_created_at ON alerts(created_at);

-- Create performance metrics table with indexes
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fcp FLOAT NOT NULL,
    lcp FLOAT NOT NULL,
    fid FLOAT NOT NULL,
    cls FLOAT NOT NULL,
    ttfb FLOAT NOT NULL,
    section_load_times JSONB NOT NULL,
    url TEXT NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance metrics
CREATE INDEX idx_metrics_timestamp ON performance_metrics(timestamp);
CREATE INDEX idx_metrics_url ON performance_metrics(url);
CREATE INDEX idx_metrics_created_at ON performance_metrics(created_at);

-- Create monitoring config table with indexes
CREATE TABLE monitoring_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for monitoring config
CREATE INDEX idx_config_key ON monitoring_config(key);
CREATE INDEX idx_config_updated_at ON monitoring_config(updated_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_alerts_updated_at
    BEFORE UPDATE ON alerts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_monitoring_config_updated_at
    BEFORE UPDATE ON monitoring_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create partitioning for performance metrics (by month)
CREATE TABLE performance_metrics_y2024m01 PARTITION OF performance_metrics
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE performance_metrics_y2024m02 PARTITION OF performance_metrics
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Add more partitions as needed...

-- Create function to automatically create new partitions
CREATE OR REPLACE FUNCTION create_performance_metrics_partition()
RETURNS TRIGGER AS $$
DECLARE
    partition_date TEXT;
    partition_name TEXT;
    start_date TEXT;
    end_date TEXT;
BEGIN
    partition_date := to_char(NEW.timestamp, 'YYYY_MM');
    partition_name := 'performance_metrics_y' || partition_date;
    start_date := to_char(date_trunc('month', NEW.timestamp), 'YYYY-MM-DD');
    end_date := to_char(date_trunc('month', NEW.timestamp + interval '1 month'), 'YYYY-MM-DD');

    IF NOT EXISTS (SELECT 1 FROM pg_class c WHERE c.relname = partition_name) THEN
        EXECUTE format(
            'CREATE TABLE %I PARTITION OF performance_metrics
             FOR VALUES FROM (%L) TO (%L)',
            partition_name, start_date, end_date
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic partition creation
CREATE TRIGGER create_performance_metrics_partition_trigger
    BEFORE INSERT ON performance_metrics
    FOR EACH ROW
    EXECUTE FUNCTION create_performance_metrics_partition(); 