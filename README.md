# Writr Goals

https://user-images.githubusercontent.com/79069364/142973672-e1965ca6-d328-4d5d-87d5-bdc92b39b2c0.mp4

### Getting Started

```yaml
---
tags:
aliases:
cssclass:
showWritingGoals: true
wordsPerMinute: 200
wordTarget: 250
charTarget: 4000
sentenceTarget: 28
wordsToRemove: 996
charsToRemove: 7799
sentencesToRemove: 2
excludeComments: true
charactersIncludeSpaces: false
description: "This is a component used to show your writing progression. Stats include: word count, character count, and sentence count."
---
```

**Creates the status board for the current note. Leave empty or set to false to avoid building the board**
`showWritingGoals`

**Configures words perminute calucation. Set to 250 by default. Leave empty to avoid changing.**
`wordsPerMinute`

**Creates the target values to calculate statuses. Leave empty or set to 0 to avoid setting status**
`charTarget`
`wordTarget`
`sentenceTarget`

**Removes values from status calculations. Leave empty or set to 0 to avoid removing values**
`wordsToRemove`
`charsToRemove`
`sentencesToRemove`

**Allows you to further configure your calculations. Leave empty or set to false to avoid configuring**
`includeFootnotes`
`charactersIncludeSpaces`
`excludeComments`

**For aesthetics ❤️**
`description`
