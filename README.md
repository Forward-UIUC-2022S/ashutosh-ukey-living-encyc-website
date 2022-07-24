# Living Encylopedia website

The Living Encyclopedia website lets users explore detailed, automatically-generated information pages about keywords related to computer science. It also has a built in tool that lets users manually verify automatically generated information.

The website is built using MySQL, Node.js + Express, and React. It can be hosted on http://encyclopedia.live.

# Setup

In order for all functionalities to work properely, ensure you are running this repository from `Osprey1.csl.illinois.edu` and you are running a production build of the backend of the the Education Today website [[Github link](https://github.com/Forward-UIUC-2022S/ashutosh-ukey-edu-today-website)].

## Database

1. Download the database from (link placeholder)

2. Import it into a MySQL database

3. Retain db name and MySQL user / password information for next steps

## Google Authentication

In order to be able to support letting keyword labelers using their Google accounts, you need to sign up for Google API service:

1. Follow the instructions on https://developers.google.com/identity/protocols/oauth2 to set this up. Make sure to specify

   ```
   http://encyclopedia.live:8080/auth/callback
   ```

   As the callback url on the API service settings on Google Cloud.

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

3. Follow the setup directions using the READMEs within each of the python modules. Within each module, if one of the steps involves downloading dependencies, Make sure the activate the for that module python virtual environment before installing with `requirements.txt`, i.e.

   ```bash
   source env/bin/activate
   pip install -r requirements.txt
   ```

   Make sure to donwnload data folders if any for each module and place them in the approporiate paths.

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

See `create_tables.sql` for information about the database schema of this website.

## Keyword information pages

Accessing the information pages of keywords is pretty straight-forward: you type in the keyword that you want and select a keyword's bubble to go to its profile page. The page will include:

- An automatically generated definition
- A timeline of the keyword's usage (i.e. counts among papers)
- A few dynamic sections (i.e. auto-generated sections that may differ from keyword-to-keyword) with relevant text blurbs scraped from the web.
- Example sentences where the keyword is used
- Popular questions related to a keyword
- Top researchers related to the keyword
- Top papers about the keyword
- Survey and tutorial papers
- Educational websites
- Related keywords

If you hover over the bubble of a related keyword, you can also find sentences that describe the relation between the current keyword and the related keyword.

## Manual labeler portal

You can access the labeler portal by clicking the profile icon in the top right corner and logging in using Google. You choose to label:

- domain relevance of a keyword
- correctness of auto-generated definitions
- relevance of tutorials or surveys of a keyword

For the domain relevance section, you can also use additional filtering tools to quickly label keywords matching the filter conditions.

# Methodology

Each module is responsible for some section(s) in every keyword's profile page:

- `angeline-prabakar-keyword-usage-within-domain`: keyword timeline

- `henrik-tseng-meaningful-relations-between-keywords`: finds the related sentences between any two keywords

- `matt-ho-keyword-related-questions`: finds most popular questions related to a keyword

- `matthew-kurapatti-classify-tutorials-surveys`: finds surveys (the research literature kind)

- `naifu-zheng-example-sentence-extraction`: finds the example sentences where the keyword is used

- `zicheng-ma-educational-website-and-courses-finder-for-keyword`: finds educational websites and courses

- `upload_processing`: computes the POS (part-of-speech) sequence and root lemma of each keyword in our database.

  This is the only Python module that is not a Git submodule. All of the above Python modules are also Git submodules

Refer to the READMEs of the other modules to see the methodology of each section. Note: there are some modules which were used to generate data that were not included in this repo. The modules are:

- Jie Huang's definition generation module (contact Kevin Chang or Jie Huang for the code)

- Ashutosh Ukey's outline generation module [[Github link](https://github.com/Forward-UIUC-2022S/ashutosh-ukey-gen-article-outline-rag)]: responsible for generating the dynamic section headings (such as "Applications", "History", "Algorithms") for reach keyword

- Zhenke's question answering module (with refactoring done by Ashutosh) [[Github link](https://github.com/Forward-UIUC-2021F/zhenke-chen-question-answering-with-text-summarization/tree/kp-integrate)]: responsible for featching relevant paragraphs for the web for each of the above dynamically generated sections

# Known issues / Pending work

- Automate setup of all python modules using a (bash) script.

- Labelers can only login using their Google account (which requires signing up for Google APIs). Support for a traditional username / password may need to be added if using Google OAuth needs to be avoided.

- Not all of the sections / modules support pre-computing results, which can be a problem because a lot of the submodules have a long run-time.

# Additional Guides

## How to deploy the website live?

Make sure you running the repository from `Osprey1.csl.illinois.edu`.

1. Run the `node-api` using

   ```
   npm run deploy
   ```

2. Create a frontend build using

   ```
   npm run build
   ```

   and then run

   ```
   npm install -g serve
   serve -l tcp://encyclopedia.live:5001 -s build
   ```

## How to add another section on the keyword profile page?

1. Add the submodule for the section in `python-modules`.

2. Within the submodule, create a new branch called `kp-integrate`

3. Create a bash script that runs the python program that will take input from `stdin` and write the results to `stdout`

4. Incorporate this script using the same techniques as the other sections in `node-api/routes/keyword.js`

## How to change the url on which the website is hosted?

Contact Engineering-IT about modifying the `nginx` reverse proxies for the Living Encyclopedia website. Change all mentions of `encyclopedia.live` in the repo to the new url.

## How to save changes to code in a submodule?

If you need to save any changes to code within a Python module that is also a Github submodule, make sure to run

```
git checkout kp-integrate
```

within the submodule's root directory. Commit and push all changes to the `kp-integrate` branch within each submodule repo as you would a regular Github repo. Make sure to use

```
git push origin kp-integrate
```

when pushing.
