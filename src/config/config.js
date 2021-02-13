export default CONFIG = {
    URL: 'https://emergency-visualizer.herokuapp.com',
     // 'http://localhost:8080', // 10.0.2.2 means localhost for android
    USERNAME: 'admin',
    PASSWORD: 'admin',
    TWITTER_DATA: {
        TwitterShareURL: 'https://aboutreact.com',
        TweetContent: 's:%DEMAND% y:%INJURED% g:%EMERGENCY% l:%COORDINATES%',
        // s: sağlıklı y: yaralı dışarıda g: göçük altında k: posta kodu l: koordinat
        TwitterViaAccount: 'AboutReact',
        TweetHashTag: 'DepremYardimCagrisi',
      } 

};
