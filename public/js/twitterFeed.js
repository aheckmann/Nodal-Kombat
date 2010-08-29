new TWTR.Widget({
  version: 2,
  type: 'profile',
  rpp: 6,
  interval: 6000,
  width: 750,
  height: 300,
  theme: {
    shell: {
      background: 'transparent',
      color: '#ffffff'
    },
    tweets: {
      background: 'transparent',
      color: '#ffffff',
      links: '#4aed05'
    }
  },
  features: {
    scrollbar: true,
    loop: false,
    live: true,
    hashtags: true,
    timestamp: true,
    avatars: false,
    behavior: 'all'
  }
}).render().setUser('NKO_Nodelicious').start();