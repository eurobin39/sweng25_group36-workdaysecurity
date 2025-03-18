
# Workday: Automated Security Testing

**SwEng Group 42 (2025)**

An automated framework that integrates security testing into development pipelines, ensuring vulnerabilities don't reappear once fixed.

## How to navigate
Our project consist of 2 parts
1. Web application used for managing and statistics observation
    - Folders: frontend; Grafana
    - Technologies used: Grafana, Next.js
2. SecOps folder - the backbone of our project, ci pipeline automation, it has it's own README.md
    - Folders: SecOps
    - Technologies used: Python, gitlab-ci, Docker, ZAP/Zest

## Folder structure
```
frontend/                               # Frontend-related code and resources
Grafana/                                # Grafana configuration
└── provisioning/                       # Holds provisioning configs for Grafana
SecOps/                                 # Security Operations resources
├── artifacts/                          # Contains artifacts generated during SecOps processes
├── pipeline/                           # Automation pipeline scripts
│   ├── py-scripts/                     # Python scripts used in the pipeline
│   ├── stages/                         # Defines different stages of the pipeline
│   └── README.md                       # Documentation for pipeline setup (IMPORTANT)
└── zest-scripts/                       # Zest scripts for security testing and automation
utils/                                  # Utility scripts and helpers
README.md                               # Project documentation and overview
```


## Documentation

[Project Overview](https://gitlab.scss.tcd.ie/tmanea/sweng25_group36-workdaysecurity/-/wikis/uploads/65c6ca802dce25e652be98d84bad9530/Project_Overview.pdf)

[User Stories](https://gitlab.scss.tcd.ie/tmanea/sweng25_group36-workdaysecurity/-/wikis/uploads/5214fc3a3efb8922dc56900c0a84b763/User_Stories.pdf)


## Authors

_Tudor Manea_ - tmanea@tcd.ie
_Yaroslav Kashulin_ - kashuliy@tcd.ie
_Aalaa Mohammed_ - aamohamm@tcd.ie
_Xiaofan Bu_ - buxi@tcd.ie
_Euro Bae_ - baee@tcd.ie
_Nicu Cirstean_ - cirstean@tcd.ie
_Eoin Bande_ - bandee@tcd.ie
_Timothy Tay_ - ttay@tcd.ie
