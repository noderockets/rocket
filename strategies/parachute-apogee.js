class ParachuteApogee {
  rocketDidActivate() {
    this.log("Using apogee detection based strategy");
    this.parachuteArmed = true;
    this.reset();
  }

  reset() {
    this.lastAltitude = Number.MIN_VALUE;
    this.descentCount = 0;
  }

  parachuteDidArm() {
    this.parachuteArmed = true;
  }

  parachuteDidDisarm() {
    this.parachuteArmed = false;
  }

  rocketDidEmitData(data) {
    if (!this.parachuteArmed) return;
    var currentAltitude = data.altitude;

    if (this.lastAltitude < data.altitude) {
      this.descentCount = 0;
      return;
    }

    if (++this.descentCount > this.props.threshold) {
      this.emit("deploy-parachute");
      this.emit("disarm-parachute");
      this.reset();
    }
  }
}
ParachuteApogee.displayName = "Parachute: Apogee";
ParachuteApogee.description =
  "Waits for the rocket to start moving downward, then deploys the parachute.";
ParachuteApogee.propTypes = {
  threshold: {
    description: "Number of measurements to verify rocket is falling.",
    type: "number",
    default: 5
  }
};
module.exports = ParachuteApogee;
