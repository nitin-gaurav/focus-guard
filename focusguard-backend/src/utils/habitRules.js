const habitThresholds = {
  Study: 120,
  Workout: 30,
  Sleep: 420,
  Phone: 60
};

const calculateStatus = (habitName, duration) => {
  if (habitName === "Phone") {
    return duration <= habitThresholds.Phone ? "Success" : "Failure";
  }
  return duration >= habitThresholds[habitName] ? "Success" : "Failure";
};

module.exports = { calculateStatus };
