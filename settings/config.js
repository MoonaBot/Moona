module.exports = {
    TOKEN: process.env.TOKEN || "YOUR_TOKEN",  // your bot token
    EMBED_COLOR: process.env.EMBED_COLOR || "#5865F2", //<= default is "#000001"

    SEARCH_DEFAULT: ["alan walker", "maroon 5", "billie eilish", "ariana grande", "ali gatie"],

    OWNER_ID: process.env.OWNER_ID || "561170896480501790", //your owner discord id example: "515490955801919488"

    NP_REALTIME: process.env.NP_REALTIME || "false", // "true" = realtime, "false" = not realtime :3 // WARNING: on set to "true" = laggy and bot will ratelimit if you have a lot of servers
    LEAVE_TIMEOUT: parseInt(process.env.LEAVE_TIMEOUT || "180000"), // leave timeout default "180000" = 3 minutes // 1000 = 1 seconds

    LANGUAGE: {
      defaultLocale: process.env.LANGUAGE || "en", // "en" = default language
      directory: process.cwd() + "/languages", // <= location of language
    },

    DEV_ID: ['561170896480501790', '656099976681750529'], // if you want to use command bot only, you can put your id here example: ["123456789", "123456789"]

    MONGO_URI: process.env.MONGO_URI || "YOUR_MONGO_URI", // your mongo uri
    LIMIT_TRACK: parseInt(process.env.LIMIT_TRACK || "20"),  //<= dafault is "50" // limit track in playlist
    LIMIT_PLAYLIST: parseInt(process.env.LIMIT_PLAYLIST || "10"), //<= default is "10" // limit can create playlist per user

    DEFAULT_SEARCH: "ytsearch", // default search engine & "ytmsearch" / "ytsearch" / "scsearch" / "spsearch"
    NODES: [
      { 
        identifier: "Kaori",
        host: process.env.NODE_HOST || "lavalink3.alfari.id",
        port: parseInt(process.env.NODE_PORT || "443"),
        password: process.env.NODE_PASSWORD || "catfein",
        secure: true
      } 
    ],
}