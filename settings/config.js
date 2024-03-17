module.exports = {
    Token: process.env.Token || "YOUR_TOKEN",  // your bot token
    ClientColor: process.env.ClientColor || "#5865F2", //<= default is "#000001"

    SearchDefault: ["Moona Hoshinova"],

    OwnerId: process.env.OwnerId || "561170896480501790", //your owner discord id example: "515490955801919488"

    NpRealtime: process.env.NpRealtime || "false", // "true" = realtime, "false" = not realtime :3 // WARNING: on set to "true" = laggy and bot will ratelimit if you have a lot of servers
    LeaveTimeout: parseInt(process.env.LeaveTimeout || "180000"), // leave timeout default "180000" = 3 minutes // 1000 = 1 seconds

    Language: {
      defaultLocale: process.env.Language || "en", // "en" = default language
      directory: process.cwd() + "/languages", // <= location of language
    },

    Developers: ['561170896480501790', '656099976681750529'], // if you want to use command bot only, you can put your id here example: ["123456789", "123456789"]

    MongoUri: process.env.MongoUri || "YOUR_MONGO_URI", // your mongo uri
    LimitTrack: parseInt(process.env.LimitTrack || "20"),  //<= dafault is "50" // limit track in playlist
    LimitPlaylist: parseInt(process.env.LimitPlaylist || "10"), //<= default is "10" // limit can create playlist per user

    DefaultSource: "youtube", // default search engine & "ytmsearch" / "ytsearch" / "scsearch" / "spsearch"
    LavalinkNodes: [
      { 
        identifier: "Moona",
        host: process.env.NODE_HOST || "pnode1.danbot.host",
        port: parseInt(process.env.NODE_PORT || "2872"),
        password: process.env.NODE_PASSWORD || "youshallnotpass",
        secure: false
      } 
    ],
}