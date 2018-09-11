// pages/lucky-draw/lucky-draw.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    redEnvelopeList0: [{
        text: "一"
      },
      {
        text: "二"
      }, {
        text: "三"
      }, {
        text: "一"
      }, {
        text: "五"
      }, {
        text: "六"
      }, {
        text: "七"
      }, {
        text: "八"
      },
      {
        text: "九"
      }, {
        text: '十',
        prize: true,
      },
    ],
    redEnvelopeList1: [{
        text: "一"
      },
      {
        text: "二"
      }, {
        text: "三"
      }, {
        text: "二"
      }, {
        text: "五"
      }, {
        text: "六"
      }, {
        text: "七"
      }, {
        text: "八"
      },
      {
        text: "九"
      }, {
        text: '十',
        prize: true,
      },
    ],
    redEnvelopeList2: [{
        text: "一"
      },
      {
        text: "二"
      }, {
        text: "三"
      }, {
        text: "三"
      }, {
        text: "五"
      }, {
        text: "六"
      }, {
        text: "七"
      }, {
        text: "八"
      },
      {
        text: "九"
      }, {
        text: '十',
        prize: true,
      },
    ],
    animation0: -30,
    animation1: -30,
    animation2: -30,
    time0: 5,
    time1: 6.2,
    time2: 7.2,
    show: true,
    flashing: true,
    winInfo: [{
        date: "08-25",
        time: "14:28",
        phone: "135****6521",
        prize: "iPad大奖"
      },
      {
        date: "08-25",
        time: "14:28",
        phone: "135****6521",
        prize: "500元大红包"
      },
      {
        date: "08-25",
        time: "14:28",
        phone: "135****6521",
        prize: "iPad大奖"
      },
      {
        date: "08-25",
        time: "14:28",
        phone: "135****6521",
        prize: "500元大红包"
      }
    ],
    prizeShow: false,
    prizeList: new Array(30),
    QR: ''
  },

 
 
  /**
   * @params sort 随机事件
   */
  sort(data) {
    //随机数组
    return data.sort((a, b) => {
      if (a.prize || b.prize) {

      } else {
        return a.text.charCodeAt() + parseInt(Math.random() * 1000) > b.text.charCodeAt() + parseInt(Math.random() * 1000)
      }
    })
  },
  /**
   * @params start 抽奖事件
   */
  start() {
    const that = this;
    //  重置数组顺序后转动两圈
    this.setData({
      redEnvelopeList0: that.sort(this.data.redEnvelopeList0),
      redEnvelopeList1: that.sort(this.data.redEnvelopeList1),
      redEnvelopeList2: that.sort(this.data.redEnvelopeList2)
    }, () => {
      that.setData({
        animation0: this.data.animation0 + 720
      })

    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  showPrize() {
    this.setData({
      prizeShow: true
    });
  },
  closePrize() {
    this.setData({
      prizeShow: false
    });
  },
  /**
   * @params lamp 跑马灯封装
   */
  lamp() {
    let flashing = !this.data.flashing;
    this.setData({
      flashing: flashing
    }, () => {
      setTimeout(() => {
        this.lamp();
      }, 250);
    });
  },
  onReady: function () {
    this.lamp();
  },
 
});