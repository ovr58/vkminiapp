import { json, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const StoryData = pgTable('storyData', {
    id: serial('id').primaryKey(),
    userId: varchar('userId'),
    storyId: varchar('storyId'),
    storySubject: text('storySubject'),
    storyType: varchar('storyType'),
    ageGroup: varchar('ageGroup'),
    imageType: varchar('imageType'),
    output: json('output'),
    coverImage: text('coverImage'),
    coverObjectText: json('coverObject'),
    coverObjectImage: json('coverObjectImage'),
    chapter1Img: text('chapter1Img'),
    chapter2Img: text('chapter2Img'),
    chapter3Img: text('chapter3Img'),
    chapter4Img: text('chapter4Img'),
    chapter5Img: text('chapter5Img')
})