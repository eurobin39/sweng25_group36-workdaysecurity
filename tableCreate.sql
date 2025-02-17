CREATE TABLE security_test_results (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE,
    repository VARCHAR(255),
    branch VARCHAR(100),
    commit_hash VARCHAR(40),
    runner VARCHAR(255),
    project_id VARCHAR(100),
    test_name VARCHAR(255),
    test_type VARCHAR(100),
    test_category VARCHAR(100),
    status VARCHAR(50),
    duration INT,
    vulnerability_found BOOLEAN
);

CREATE TABLE assertions (
    id SERIAL PRIMARY KEY,
    security_test_id INT REFERENCES security_test_results(id) ON DELETE CASCADE,
    name VARCHAR(255),
    status VARCHAR(50),
    expected TEXT,
    actual TEXT,
    risk VARCHAR(50),
    confidence VARCHAR(50),
    message TEXT
);
