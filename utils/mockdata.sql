
TRUNCATE security_test_results CASCADE;


DO $$
DECLARE
    repos text[] := ARRAY['web-app', 'api-service', 'mobile-app', 'payment-gateway', 'auth-service'];
    branches text[] := ARRAY['main', 'develop', 'feature/auth', 'feature/payment', 'hotfix/security'];
    test_types text[] := ARRAY['SAST', 'DAST', 'IAST', 'SCA'];
    test_categories text[] := ARRAY['Injection', 'XSS', 'Authentication', 'Configuration', 'Data Exposure'];
    test_names text[] := ARRAY['SQL Injection Scan', 'XSS Detection', 'Auth Bypass Test', 'CORS Check', 'Sensitive Data Exposure'];
    developers text[] := ARRAY['dev1', 'dev2', 'dev3', 'dev4', 'dev5'];
    projects text[] := ARRAY['1', '2', '3', '4', '5'];
    
    i INT;
    test_time TIMESTAMP;
    commit_hash TEXT;
    test_status TEXT;
    vuln_found BOOLEAN;
BEGIN
    
    FOR hour_offset IN 0..23 LOOP
        FOR test_num IN 1..(3 + floor(random() * 5)) LOOP
            
            test_time := NOW() - (hour_offset * INTERVAL '1 hour') + (random() * INTERVAL '1 hour');
            commit_hash := substring(md5(random()::text), 1, 12);
            test_status := CASE WHEN random() > 0.3 THEN 'pass' ELSE 'fail' END;
            vuln_found := test_status = 'fail' AND random() > 0.4;
            
            
            INSERT INTO security_test_results (
                commit_hash, timestamp, repository, branch, runner,
                project_id, test_name, test_type, test_category,
                status, duration, vulnerability_found
            ) VALUES (
                commit_hash,
                test_time,
                repos[1 + floor(random() * array_length(repos, 1))],
                branches[1 + floor(random() * array_length(branches, 1))],
                developers[1 + floor(random() * array_length(developers, 1))],
                projects[1 + floor(random() * array_length(projects, 1))],
                test_names[1 + floor(random() * array_length(test_names, 1))],
                test_types[1 + floor(random() * array_length(test_types, 1))],
                test_categories[1 + floor(random() * array_length(test_categories, 1))],
                test_status,
                5 + random() * 25, 
                vuln_found
            );
            
            
            IF test_status = 'fail' THEN
                INSERT INTO assertions (
                    commit_hash, name, status, expected, actual,
                    risk, confidence, message
                ) VALUES (
                    commit_hash,
                    test_categories[1 + floor(random() * array_length(test_categories, 1))] || ' Vulnerability',
                    'fail',
                    'No vulnerabilities expected',
                    CASE 
                        WHEN random() > 0.7 THEN 'Critical vulnerability detected'
                        WHEN random() > 0.4 THEN 'Multiple issues found'
                        ELSE 'Security weakness identified'
                    END,
                    CASE 
                        WHEN random() > 0.7 THEN 'Critical'
                        WHEN random() > 0.4 THEN 'High'
                        ELSE 'Medium'
                    END,
                    CASE 
                        WHEN random() > 0.7 THEN 'High'
                        WHEN random() > 0.4 THEN 'Medium'
                        ELSE 'Low'
                    END,
                    CASE 
                        WHEN random() > 0.8 THEN 'Immediate remediation required'
                        WHEN random() > 0.5 THEN 'Needs review by security team'
                        ELSE 'Should be fixed in next sprint'
                    END
                );
                
                
                IF random() > 0.7 THEN
                    INSERT INTO assertions (
                        commit_hash, name, status, expected, actual,
                        risk, confidence, message
                    ) VALUES (
                        commit_hash,
                        'Secondary Check',
                        CASE WHEN random() > 0.6 THEN 'pass' ELSE 'fail' END,
                        'No secondary issues',
                        CASE WHEN random() > 0.6 THEN 'Clean' ELSE 'Additional problems found' END,
                        'Low',
                        'Medium',
                        'Related security check'
                    );
                END IF;
            END IF;
        END LOOP;
    END LOOP;
END $$;


SELECT 
    DATE_TRUNC('hour', timestamp) AS hour,
    COUNT(*) AS total_tests,
    SUM(CASE WHEN status = 'pass' THEN 1 ELSE 0 END) AS passed,
    SUM(CASE WHEN status = 'fail' THEN 1 ELSE 0 END) AS failed,
    SUM(CASE WHEN vulnerability_found THEN 1 ELSE 0 END) AS vulnerabilities,
    ROUND(SUM(CASE WHEN status = 'pass' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS pass_rate
FROM security_test_results
GROUP BY DATE_TRUNC('hour', timestamp)
ORDER BY hour;