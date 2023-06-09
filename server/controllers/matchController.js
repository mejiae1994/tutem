const asyncHandler = require("express-async-handler");
const Match = require("../models/matchModel");
const User = require("../models/userModel");
const Message = require("../models/messageModel");
const { performance } = require("perf_hooks");

const upsertMatches = asyncHandler(async (req, res) => {
  //grab all users Id and rightswipe
  const start = performance.now();
  const users = await User.find({}, "_id rightSwipe");

  if (!users) {
    throw new Error("no users found");
  }

  const userMatches = findPotentialMatch(users);
  if (userMatches.length < 1) {
    console.log("no matches at this time");
    return;
  }

  const flattenedMatches = createUserMatchMap(userMatches);

  const userBulkWriteArray = Array.from(flattenedMatches, ([key, value]) => {
    return {
      updateOne: {
        filter: { userId: key },
        update: { $addToSet: { matches: value } },
        upsert: true,
      },
    };
  });

  const matches = await Match.bulkWrite(userBulkWriteArray);
  const end = performance.now();
  console.log(`Execution time for api/matches ${end - start} ms`);
});

//getMatches
const getMatches = asyncHandler(async (req, res) => {
  const matches = await Match.find();

  if (!matches) {
    throw new Error("no matches found");
  }

  res.status(200).json(matches);
});

//getMatch
const getMatch = asyncHandler(async (req, res) => {
  //find current user matches
  const start = performance.now();
  const match = await Match.find({ userId: req.params.id });

  if (match.length < 1) {
    res.status(200).json([]);
    return;
  }

  //get users data using user Ids from the match collection
  const [matchObj] = match;
  const users = await User.find({ _id: { $in: matchObj.matches } }).lean();

  //get the last message fo each user and append it
  let usersWithLastMessage = await Promise.all(
    users.map(async (user, index) => {
      try {
        let messageId = Array.from(user._id + req.params.id)
          .sort()
          .join("");

        let singleMessage = await Message.findOne({ id: messageId }).sort({
          updatedAt: -1,
        });

        let modifiedUser = {
          ...user,
          lastMessage: singleMessage,
        };

        return modifiedUser;
      } catch (error) {
        console.log(error);
      }
    })
  );

  const end = performance.now();
  console.log(`Execution time for api/matches/:id ${end - start} ms`);
  res.status(200).json(usersWithLastMessage);
});

function findPotentialMatch(userCollection) {
  let matches = [];
  let i = 0;
  let j = 1;

  while (j < userCollection.length) {
    let swipeArr = userCollection[i];
    let nextSwipeArr = userCollection[j];

    if (findMatches(swipeArr, nextSwipeArr)) {
      matches.push(
        { [userCollection[i].id]: userCollection[j].id },
        { [userCollection[j].id]: userCollection[i].id }
      );
    }

    if (j === userCollection.length - 1) {
      i++;
      j = i + 1;
    } else {
      j++;
    }
  }
  return matches;
}

function findMatches(obj, obj2) {
  return obj2.rightSwipe.includes(obj.id) && obj.rightSwipe.includes(obj2.id)
    ? true
    : false;
}

// Define the function to add an element to the hashmap
//continue working on this function to construct an array of Id objects that have an array containing Ids of all the matches
function createUserMatchMap(matchesArray) {
  let map = new Map();
  matchesArray.forEach((key, value) => {
    const [user, swipe] = Object.entries(key)[0];
    if (map.get(user)) {
      map.get(user).push(swipe);
    } else {
      map.set(user, [swipe]);
    }
  });

  return map;
}

module.exports = { upsertMatches, getMatch, getMatches };
