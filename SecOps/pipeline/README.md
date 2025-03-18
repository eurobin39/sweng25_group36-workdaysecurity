# Pipeline
You can find pipeline related code in here:
    - scripts that assist pipeline with gathering, packing and sending data
    - stages folder with `penTestStage.yml`

## Steps
In order to use our tool you have to follow this steps
1. Copy SecOps folder
2. Deleted existing scripts
3. Added new scripts
4. Modified SecOps/pipeline/stages runTests.yml
5. Included SecOps/pipeline/stages runTests.yml and saveResults.yml
6. Included runner into the project in CI/CD Runners
7. Added env vars for DB connection in CI/CD Variables
