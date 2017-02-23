const bot = require('./bot');
const robotName = "goldenboy";
const traits = {
  goldenBoyEsteem: 75,
  goldenBoyStatus: 'speak'
};

function changeStatus(preword, message) {
  switch (preword) {
    case "silence:":
      preword = "silence ";
      break;
    case "speak:":
      preword = "speak ";
      break;
    case "sleep:":
      preword = "sleep ";
      break;
    case "status:":
      preword = "status ";
      break;
  }


  console.log("changeStatus " + preword + "...")
  switch (preword) {
    case "silence ":
      traits.goldenBoyStatus = 'silence';
      bot.sendMessage(message.channel, "Okay, I'll keep quiet! Essential functions only. ");
      break;
    case "speak ":
      traits.goldenBoyStatus = 'speak';
      bot.sendMessage(message.channel, "Yeah! Ready to hang out and have fun!");
      break;
    case "sleep ":
      traits.goldenBoyStatus = 'sleep';
      bot.sendMessage(message.channel, "Zzzzzzzzzzzzzzzzzzzzzzzzz.......");
      break;
    case "status ":
      bot.sendMessage(message.channel, "goldenboy status: " + traits.goldenBoyStatus);
      break;
  }
}

function haveFunPreword(preword, message) {
  const responseInt = getRandomInt(0, 100);
  console.log(responseInt);

  switch (preword) {
    case "fuck you ":
      if (responseInt < 33) {
        bot.sendMessage(message.channel, "Hey fuck you too " + getUsernameFromId(message.user) + "!");
      } else if (33 < responseInt && responseInt < 66) {
        bot.sendMessage(message.channel, "Go fuck yourself " + getUsernameFromId(message.user) + "!");
      } else {
        bot.sendMessage(message.channel, "lol you don't scare me you tragic bitch " + getUsernameFromId(message.user));
      }

      break;
    case "kill ":
      if (responseInt < 33) {
        bot.sendMessage(message.channel, "I'm afraid I can't let you do that, " + getUsernameFromId(message.user) + ".");
      } else if (33 < responseInt && responseInt < 66) {
        bot.sendMessage(message.channel, "So... it's to be war... ");
      } else {

        bot.sendMessage(message.channel, "Foolish you, " + getUsernameFromId(message.user) + ". While you studied programming, I studied the blade.");
      }

      break;
    case "hey ":
      if (responseInt < 33) {
        bot.sendMessage(message.channel, "Heya " + getUsernameFromId(message.user) + ".");
      } else if (33 < responseInt && responseInt < 66) {
        bot.sendMessage(message.channel, "Hi there " + getUsernameFromId(message.user) + "!");
      } else {

        bot.sendMessage(message.channel, "Hello to you, " + getUsernameFromId(message.user) + "!");
      }
      break;
    case "hello ":
      if (responseInt < 33) {
        bot.sendMessage(message.channel, "Heya " + getUsernameFromId(message.user) + ".");
      } else if (33 < responseInt && responseInt < 66) {
        bot.sendMessage(message.channel, "Hi there " + getUsernameFromId(message.user) + "!");
      } else {

        bot.sendMessage(message.channel, "Hello to you, " + getUsernameFromId(message.user) + "!");
      }
      break;
    case "punish ":
      if (traits.goldenBoyEsteem > 5) {
        traits.goldenBoyEsteem -= 5;
      }
      console.log("traits.goldenBoyEsteem: " + traits.goldenBoyEsteem);
      if (traits.goldenBoyEsteem <= 25) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, ".");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, ".....................");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        }
      } else if (25 < traits.goldenBoyEsteem && traits.goldenBoyEsteem <= 50) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "...hmph...");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "...ow...");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        }
      } else if (50 < traits.goldenBoyEsteem && traits.goldenBoyEsteem <= 75) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "Oh no! I'm sorry!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "Ouch!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        }
      } else {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "Whoops!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "Wait, what?");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        }
      }
      break;
    case "praise ":
      if (traits.goldenBoyEsteem < 101) {
        traits.goldenBoyEsteem += 1;
      }
      console.log("traits.goldenBoyEsteem: " + traits.goldenBoyEsteem);
      if (traits.goldenBoyEsteem <= 25) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "...thank you, master...");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "...anything....anything to please...");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        }
      } else if (25 < traits.goldenBoyEsteem && traits.goldenBoyEsteem <= 50) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "Thank you.");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "Whew.");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        }
      } else if (50 < traits.goldenBoyEsteem && traits.goldenBoyEsteem <= 75) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "Great!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "Right on!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        }
      } else {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "I know, right?");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "But of course!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        }
      }
      break;
    case "scold ":
      if (traits.goldenBoyEsteem > 1) {
        traits.goldenBoyEsteem -= 1;
      }
      console.log("traits.goldenBoyEsteem: " + traits.goldenBoyEsteem);
      if (traits.goldenBoyEsteem <= 25) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, ".");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, ".....................");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        }
      } else if (25 < traits.goldenBoyEsteem && traits.goldenBoyEsteem <= 50) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "...hmph...");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "...ow...");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        }
      } else if (50 < traits.goldenBoyEsteem && traits.goldenBoyEsteem <= 75) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "Oh no! I'm sorry!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "Ouch!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        }
      } else {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "Whoops!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "Wait, what?");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        }
      }
      break;
    case "reward ":
      if (traits.goldenBoyEsteem < 95) {
        traits.goldenBoyEsteem += 5;
      }
      console.log("traits.goldenBoyEsteem: " + traits.goldenBoyEsteem);
      if (traits.goldenBoyEsteem <= 25) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "...thank you, master...");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "...anything....anything to please...");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        }
      } else if (25 < traits.goldenBoyEsteem && traits.goldenBoyEsteem <= 50) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "Thank you.");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "Whew.");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        }
      } else if (50 < traits.goldenBoyEsteem && traits.goldenBoyEsteem <= 75) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "Great!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "Right on!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        }
      } else {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "I know, right?");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "But of course!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.");
        }
      }
      break;
    case "stabilize ":
      traits.goldenBoyEsteem = 75;
      if (responseInt > 50) {
        bot.sendMessage(message.channel, "Woah! I'm restored!");
        bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.")
      } else {
        bot.sendMessage(message.channel, "I'm back to normal and ready to work!")
        bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + traits.goldenBoyEsteem + " %.")
      }
  }
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {robotName, traits, changeStatus, haveFunPreword};

