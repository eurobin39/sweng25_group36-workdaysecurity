# SecOps
This is the folder that has to be copied to the projects if you want to add them to general penetration test
automation pipeline.

It has several folders:
    - `artifacts/`      contains artifacts generated during SecOps processes
    - `pipeline/`
        - `py-scripts/` assists pipeline with gathering, packing and sending data
        - `stages/`     stages that you have to `include` into the main gitlab-ci.yml file
    - `zest-scripts`    contains zest-scripts that Security engineer has to write

## Steps
In order to use our tool you have to follow this steps
1. Copy SecOps folder
2. Deleted existing scripts from `SecOps/zest-scripts`
3. Added new scripts into `SecOps/zest-scripts`
4. Modified `SecOps/pipeline/stages runTests.yml`
5. Included `SecOps/pipeline/stages runTests.yml` and `saveResults.yml`
6. Included runner into the project in CI/CD Runners
7. Added env vars for DB connection in CI/CD Variables
