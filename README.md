# "Living Encylopedia" website

The "Living Encyclopedia" website lets users explore detailed, automatically-generated information pages about keywords related to computer science. It also has a built in tool that lets users manually verify such information.

The website is built using MySQL, Node.js + Express, and React. It can be hosted on http://encyclopedia.live. In order for all functionalities to work properely, ensure you are running this repository from `Osprey1.csl.illinois.edu`

# Setup

## Database

1. Download the database from (link placeholder) 

2. Import it into a MySQL database

If you want to precache all results, make sure to update the database accordingly.

## Google Authentication

In order to be able to support letting manual keyword labelers using their Google accounts, you need to sign up for Google API service: 

1. Follow the instructions on https://developers.google.com/identity/protocols/oauth2 to set this up. Make sure to use 

    ```
    http://localhost:5000/auth/callback
    ```

    As the callback url. 

2. Keep the client ID, client secret, and callback url handy as you will need them to populate the `.env` file in `node-api`

## Dependencies
1. Pull code for all git submodule codes using

    ```bash
    git submodule init
    git submodule update
    ```

2. Create a python virtual environment inside the root folder of each python module

    ```bash
    # For python3
    python3 -m venv env

    # For python2
    virtualenv env
    ```

    Note that all python modules reside in the `python-modules` directory.

3. Follow the setup directions within the README of each python module. Within each module, if one of the steps involves downloading dependencies using a `requirements.txt`, make sure the activate the python virtual environment before installing `requirements.txt`, i.e.

    ```bash
    source env/bin/activate
    pip install -r requirements.txt
    ```

    Make sure to donwnload any data folders (if any) for each module and place them in the approporiate paths. If you need to save any changes to code within a Python module that is also a Github submodule, make sure to run 

    ```
    git checkout kp-integrate
    ```

    within the submodule's root directory. Commit and push all changes to the `kp-integrate` branch within each submodule repo as you would a regular Github repo.


4. Install node dependencies within the `node-api` and `react-app` folders by running

    ```bash
    npm install
    ```

    within the root directory of each.

5. Within the root of `node-api`, `react-app`, and `python-modules` folders, rename `.env.template` to `.env` and change the fileds with the appropriate information.

## Running the website (development build)

1. In one shell terminal, run the backend using

    ```bash
    node index.js
    ```

    inside `node-api`. Note: you may also need to run the the "Education Today" backend api from `osprey2` in order for some of the sections in a keyword's profile page to display correctly for this website. 

2. In another shell terminal, run the frontend using

    ```bash
    npm start
    ```

    inside `react-app`

# Demo video 
Coming soon

# Usage (design and functionalities)

## Keyword information pages
Accessing the information pages of keywords is pretty straight-forward: you type in the keyword that you want and select a keyword's bubble to go to its profile page. The page will include:

* An automatically generated definition
* A timeline of the keyword's usage
* A few dynamic sections with corresponding relevant paragraphs scraped from the web. 
* Example sentences where the keyword is used
* Top researchers related to the keyword
* Top papers about the keyword
* Survey and tutorial papers
* Educational websites
* Related keywords

If you hover over the bubble of a related keyword, you can also find sentences that describe the relation between the current keyword and the related keyword.

## Manual labeler portal
You can access the labeler portal by clicking the profile icon in the top right corner and logging in using Google. You choose to label:

* domain relevance of a keyword
* correctness of auto-generated definitions
* relevance of tutorials or surveys of a keyword

For the domain relevance section, you can also use additional filtering tools to quickly label keywords matching the filter conditions. 

# Methodology

Each module is responsible for some section(s) in every keyword's profile page:

* `angeline-prabakar-keyword-usage-within-domain`: keyword timeline

* `henrik-tseng-meaningful-relations-between-keywords`: finds the related sentences between any two keywords

* `naifu-zheng-example-sentence-extraction`: finds the example sentences where the keyword is used

* `zicheng-ma-educational-website-and-courses-finder-for-keyword`: finds 

* `upload_processing`: computes the POS (part-of-speech) sequence and root STEM of a keyword.

# Known issues / Pending work

* Automate setup of all python modules using a (bash) script. 

* Labelers can only login using their Google account (which requires signing up for Google APIs). Support for a traditional username / password may need to be added if using Google OAuth needs to be avoided.

## Development Notes

- Tag POS and stem when user uploads (no need to make it a continous seperate process)
- Group by stems when labeling => Make id 'stem', concatenate all
  real names of keywords and store in indexed 'name' field
- Include git submodule of definition generating cron job in api/services?
- Should Advanced Search be kept in definition and tutorial finding? (probably, yes)
- Raw check full POS pattern of each keyword, check common substring on word granularity
- useState on timer and clearTimeout before every state update, cancel prev get request as well using controller.
- Make state store selected row groups, store seperate if for which keyword's info to display on the info pane
- Display definition info if retrieved first in KeywordPane
- Mark prioirtiy by alt colored keywords (partially labeled roots, ground truth labels)
- How to select the number of priority keywords to show? Calculate ratio of number of keywords labeled vs test keywords. Only show test keywords when ratio is below some threshold.
- Priority: partially labeled roots first (depending on labeling entity type), test keywords.


# Additional Guides 

## How to deploy the website live?

Make sure you running the repository from `Osprey1.csl.illinois.edu`. 

1. Run the `node-api` using the same steps as in the `Setup` section of this README.

2. Create a frontend build using

    ```
    npm run build
    ```

    and then 

    ```
    serve -l tcp://encyclopedia.live:5000 -s build
    ```

## How to add another section? 

1. Add the submodule for the section in `python-modules`. 

2. Create a bash script that runs the python program that will take input from `stdin` and write the results to `stdout`

3. Incorporate this script using the same techniques as the other sections in `node-api/routes/keyword.js`


## How to change the url on which the website is hosted?

Contact Engineering-IT about modifying the `nginx` reverse proxies.