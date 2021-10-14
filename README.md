# keyword-pages

Combining an existing keyword-labeling tool and keyword dictionary website. The website is built on React and Node.js (Express)

## Development Notes

- Tag POS and stem when user uploads (no need to make it a continous seperate process)
- Group by stems when labeling => Make id 'stem', concatenate all
  real names of keywords and store in indexed 'name' field
- Include git submodule of definition generating cron job in api/services?
- Should Advanced Search be kept in definition and tutorial finding? (probably, yes)
- Raw check full POS pattern of each keyword, check common substring on word granularity
- useState on timer and clearTimeout before every state update, cancel prev get request as well using controller.
