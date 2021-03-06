// SRC season II
// Special thanks to Notus, for testing, code review, and big help in developing

"use strict";
var Enum = (desc) => String(desc).split(/\W+/).reduce((en, key, i) => (en[key] = ++i, en), {});
var games = Enum("public_event, championship, free_practice, testing");
var vehicles = Enum("sprint, endurance");

var game_type = games.testing;
var vehicle_type = vehicles.endurance;

var rotate_tracks = false;
var show_championship_table = false;
var championship_points = [10,8,6,4,3,2,1];

var season_race_number = 2;
var max_players = 17;

var qualification_duration = 900;
var race_laps = 10;
var race_start_delay = 11;
var race_start_countdown = 6;
var race_close_time = 30;

var set_end_times = function() {
  if (rotate_tracks) {
    // Multiple tracks, endless game
    time_after_race = 35;
    end_message_time = 10;
  } else {
    // One track with gameover
    time_after_race = 150;
    end_message_time = 15;
  }
};

var ship_switch_delay = 0.5;

var drs_step = 400;
var enable_drs_on_race_lap = 2;

// AFK settings
var afk_timeout = 20;
var afk_speed = 0.25;
var afk_action = function(ship) {
  respawn_ship(ship);
};

var troll_timeout = 75;
// var troll_afk_timeout = afk_timeout / 2;

// Out lap detection settings
var outlap_delay = 2;
var onlap_blink_time = 2.5;
var lap_map_precision = 2;
var lap_map_overlap = 1;

// Messages
var positions = ["1st","2nd","3rd"];
var welcome_message = {
  [games.public_event]: "SRC open championship! There is a standings appear between races. For victory and other high places you get points. At the end of the last race, if you have the most points - you are the champion!",
  [games.championship]: "Welcome to the SRC II! Don't forget that points are played here (6,4,3,2,1,1 for pole). Race with your real discord nick, good luck!",
  [games.free_practice]: "\nIt's free practice. The test of the track. You can study the track, but don't forget about the simple rules! (Without trolling, the Zoltar from FIA is still watching you!) Good luck!",
  [games.testing]: "\nTesting mode\nsome features disabled\n",
};

// Init some settings
var public_event, map_name;
if (game_type == games.public_event) {
  public_event = true;
  rotate_tracks = true;
  show_championship_table = true;
} else if (game_type == games.championship) {
  map_name = `SRC: Race ${season_race_number}`
} else if (game_type == games.free_practice) {
  map_name = `SRC: Free Practice`
}
var time_after_race, end_message_time;
set_end_times();


// Chat

var vocabulary = [
  { text: "Hello", icon:"\u0045", key:"H" },
  { text: "Bye Bye!", icon:"\u0027", key:"B" },
  { text: "Yes", icon:"\u004c", key:"Y" },
  { text: "No", icon:"\u004d", key:"N" },

  { text: "GG", icon:"\u00a3", key:"G" },
  { text: "Overtake!", icon:"\u00bd", key:"O" },
  { text: "A'm a torpedo!", icon:"\u006a", key:"T" },
  { text: "Thanks", icon:"\u0041", key:"X" },

  { text: "Sorry", icon:"\u00a1", key:"S" },
  { text: "WTF", icon:"\u004b", key:"Q" },
  { text: "No Problem", icon:"\u0047", key:"P" },
  { text: "Wait", icon:"\u0046", key:"W" },
];


// Ships

var Booster_101 = '{"name":"Booster","level":1,"model":1,"size":1.62,"zoom":0.75,"designer":"Zerd","next":[],"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[200,200],"reload":[19,29]},"ship":{"mass":250,"speed":[290,290],"rotation":[60,60],"acceleration":[120,120],"dash":{"rate":2,"burst_speed":[250,250],"speed":[450,450],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"bodies":{"main1":{"section_segments":8,"offset":{"x":60,"y":-55,"z":-9},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0],"y":[-55,-33,-40,0,10,40,48,70,80,70],"z":[0,0,0,0,0,0,0,0,0,0,0]},"width":[0,6,14,20,14,14,20,20,15,0],"height":[0,6,14,20,11,11,15,15,10,0],"propeller":true,"texture":[4,18,10,63,8,63,10,63,17]},"main2":{"section_segments":6,"offset":{"x":0,"y":0,"z":10},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-55,-60,-50,-20,10,15,45,75,60],"z":[-7,-7,-5,0,0,0,0,0,0]},"width":[0,8,15,25,25,20,20,14,0],"height":[0,5,10,15,18,18,18,14,0],"propeller":true,"texture":[1,63,1,1,5,8,12,17]},"cockpit":{"section_segments":7,"offset":{"x":0,"y":-48,"z":22},"position":{"x":[0,0,0,0,0,0,0],"y":[0,0,20,30,90],"z":[-9,-9,0,0,0]},"width":[0,5,14,14,11],"height":[0,4,5,7,7],"texture":[7,9,9,4]},"cannons":{"section_segments":6,"offset":{"x":20,"y":30,"z":10},"position":{"x":[0,0,0,0,0,0],"y":[-60,-70,-30,0,25,30],"z":[0,0,0,0,0,0]},"width":[0,5,6,11,7,0],"height":[0,5,6,11,7,0],"angle":180,"texture":[3,8,10,63]},"cannons2":{"section_segments":6,"offset":{"x":27,"y":0,"z":-5},"position":{"x":[0,0,0,0,0,0],"y":[-70,-80,-35,0,25,30],"z":[0,0,0,0,0,0]},"width":[0,5,6,11,7,0],"height":[0,5,6,11,7,0],"angle":180,"texture":[3,8,10,63]},"cannons3":{"section_segments":8,"offset":{"x":0,"y":32,"z":-30},"position":{"x":[0,0,0,0,0,0],"y":[-2,-2,-3,0,10,10],"z":[0,0,0,0,0,0]},"width":[0,8,12,16,16,0],"height":[0,8,12,16,16,0],"angle":180,"vertical":true,"texture":[18,17,10,63]},"cannons4":{"section_segments":7,"offset":{"x":20,"y":60,"z":10},"position":{"x":[0,0,0,0,0,0],"y":[-5,-6,-5,0,1,-5],"z":[0,0,0,0,0,0]},"width":[7,7,10,10,7,7],"height":[7,7,10,10,7,7],"angle":180,"texture":[3,8,10,63]},"cannons6":{"section_segments":7,"offset":{"x":20,"y":70,"z":10},"position":{"x":[0,0,0,0,0,0],"y":[-5,-6,-5,0,1,-5],"z":[0,0,0,0,0,0]},"width":[7,7,10,10,7,7],"height":[7,7,10,10,7,7],"angle":180,"texture":[3,8,10,63]},"cannons5":{"section_segments":8,"offset":{"x":20,"y":15,"z":-5},"position":{"x":[0,0,0,0,0,0],"y":[-5,-6,-5,0,1,-5],"z":[0,0,0,0,0,0]},"width":[7,7,12,12,7,7],"height":[7,7,12,12,7,7],"angle":125,"vertical":true,"texture":[3,17,63,63]},"cannons7":{"section_segments":6,"offset":{"x":4,"y":12,"z":20},"position":{"x":[0,0,0,0,0,0],"y":[-5,-6,-16,0,1,-5],"z":[0,0,0,0,0,0]},"width":[7,7,12,12,7,7],"height":[7,7,12,12,7,7],"angle":180,"texture":[3,9,15,63]},"cannons8":{"section_segments":6,"offset":{"x":5,"y":-5,"z":18},"position":{"x":[0,0,0,0,0,0],"y":[-10,-15,-14,0,1,-5],"z":[0,0,0,0,0,0]},"width":[7,7,12,12,7,7],"height":[7,7,12,12,7,7],"angle":180,"texture":[3,63,8,63]},"cannons9":{"section_segments":8,"offset":{"x":0,"y":-15,"z":20},"position":{"x":[0,0,0,0,0,0],"y":[-5,-5,-5,0,0,0],"z":[0,0,0,0,0,0]},"width":[10,10,15,15,10,10],"height":[7,7,12,12,7,7],"angle":180,"texture":[63]},"cannons10":{"section_segments":6,"offset":{"x":60,"y":-20,"z":-4},"position":{"x":[0,0,0,0,0,0],"y":[-5,-6,-13,0,1,-5],"z":[0,0,0,0,0,0]},"width":[7,7,12,12,7,7],"height":[7,7,12,12,7,7],"angle":180,"texture":[3,9,8,63]},"cannons11":{"section_segments":6,"offset":{"x":60,"y":-39,"z":-1},"position":{"x":[0,0,0,0,0,0],"y":[-50,-40,-20,2,25,30],"z":[0,0,0,0,0,0]},"width":[0,7,7,7,7,0],"height":[0,7,7,7,7,0],"angle":180,"texture":[3,4,17,4]},"cannons12":{"section_segments":6,"offset":{"x":60,"y":-35,"z":-4},"position":{"x":[0,0,0,0,0,0],"y":[-5,-9,-8,0,1,-5],"z":[0,0,0,0,0,0]},"width":[7,7,12,12,7,7],"height":[7,7,12,12,7,7],"angle":180,"texture":[3,4,4,63]},"cannons13":{"section_segments":14,"offset":{"x":60,"y":-51,"z":-4},"position":{"x":[0,0,0,0,0,0],"y":[-5,-13,-12,4,1,-5],"z":[0,0,0,0,0,0]},"width":[7,7,12,12,7,7],"height":[7,7,12,12,7,7],"angle":180,"texture":[3,4,8,63]}},"wings":{"main1":{"length":[23,23],"width":[50,35,30],"angle":[-10,-30],"position":[-3,-18,-25],"doubleside":true,"offset":{"x":16,"y":-12,"z":5},"bump":{"position":35,"size":15},"texture":[1,63]},"main2":{"length":[35],"width":[37,15],"angle":[-25],"position":[0,15],"doubleside":true,"offset":{"x":65,"y":-34,"z":-9},"bump":{"position":30,"size":15},"texture":[63]}},"typespec":{"name":"Booster","level":1,"model":1,"code":201,"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[200,200],"reload":[19,29]},"ship":{"mass":250,"speed":[290,290],"rotation":[60,60],"acceleration":[120,120],"dash":{"rate":2,"burst_speed":[250,250],"speed":[450,450],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"shape":[1.948,1.957,1.791,1.52,4.06,3.902,3.795,3.437,3.187,3.03,3.249,3.234,3.158,2.612,2.637,2.593,2.198,1.68,1.449,1.627,1.918,2.398,2.784,3.335,3.298,2.435,3.298,3.335,2.784,2.398,1.918,1.627,1.449,1.68,2.198,2.593,2.637,2.612,3.158,3.234,3.249,3.03,3.187,3.437,3.795,3.902,4.06,1.52,1.791,1.957],"lasers":[],"radius":4.06,"next":[]}}';

var Astral_Accelerator_102 = '{"name":"Astral Accelerator","level":1,"model":2,"size":1.54,"zoom":0.72,"designer":"Finalizer","next":[],"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[200,200],"reload":[19,29]},"ship":{"mass":200,"speed":[310,310],"rotation":[70,70],"acceleration":[90,90],"dash":{"rate":2,"burst_speed":[250,250],"speed":[400,400],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"bodies":{"main":{"section_segments":10,"offset":{"x":0,"y":-40,"z":10},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-90,-93,-95,-90,-30,0,50,100,105,90],"z":[-7,-7,-7,-7,-7,-7,0,0,0]},"width":[20,23,25,27,30,27,30,26,15,0],"height":[0,6,8,10,15,18,8,10,10,0],"texture":[17,13,17,1,10,1,10,12,17],"propeller":true},"stripes":{"section_segments":16,"offset":{"x":15,"y":-40,"z":10},"position":{"x":[-4,-4,-4,11,5,0,0,0],"y":[-92,-30,0,50,100],"z":[1,6,10,3,3,0]},"width":[3,3,3,3,3,3],"height":[1,1,1,1,1],"texture":[63]},"cockpit":{"section_segments":[40,90,180,270,320],"offset":{"x":0,"y":-55,"z":22},"position":{"x":[0,0,0,0,0,0],"y":[15,35,65,85,105],"z":[-1,-4,-5,-6,-2]},"width":[5,11,12,12,5],"height":[0,12,15,15,0],"texture":[8.98,8.98,63]},"detail":{"section_segments":8,"angle":3,"offset":{"x":26,"y":-56,"z":6},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[0,3,3,11,11,21,21,29,29,39,39,47,47,57,57,65,65],"z":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"width":[1,4,5,5,4,4,5,5,4,4,5,5,4,4,5,5,1],"height":[1,4,6,4,1,4,6,4,1,4,6,4,1,4,6,4,1],"texture":[4,17,17,4,4,17,17,4,4,17,17,4,4,17,17,4]},"engines":{"section_segments":12,"offset":{"x":28,"y":-10,"z":10},"position":{"x":[0,0,0,0,0,0,0,0],"y":[25,20,25,55,75,73,70],"z":[5,0,0,0,0,0,0,0]},"width":[0,5,7,8,8,6,0],"height":[0,5,7,8,8,6,0],"texture":[13,3,8,13,18,17],"propeller":true},"hubs1":{"vertical":true,"section_segments":12,"offset":{"x":0,"y":10,"z":90},"position":{"x":[0,0,0,0,0,0,0],"y":[0,10,7,7,10,9],"z":[0,0,0,0,0,0,0]},"width":[9,7,6,6,5,0],"height":[9,7,6,6,5,0],"texture":[11,18,17,18,18]},"hubs2":{"vertical":true,"section_segments":12,"offset":{"x":0,"y":10,"z":105},"position":{"x":[0,0,0,0,0,0,0],"y":[0,10,7,7,10,9],"z":[0,0,0,0,0,0,0]},"width":[9,7,6,6,5,0],"height":[9,7,6,6,5,0],"texture":[11,18,17,18,18]},"hubs3":{"vertical":true,"section_segments":12,"offset":{"x":0,"y":10,"z":75},"position":{"x":[0,0,0,0,0,0,0],"y":[0,10,7,7,10,9],"z":[0,0,0,0,0,0,0]},"width":[9,7,6,6,5,0],"height":[9,7,6,6,5,0],"texture":[11,18,17,18,18]}},"wings":{"main":{"length":[25,0,5],"width":[40,20,90,20],"angle":[-5,5,25],"position":[-15,5,-10,0],"texture":[1,11,63],"doubleside":true,"bump":{"position":30,"size":20},"offset":{"x":20,"y":30,"z":10}},"font":{"length":[40],"width":[61,10],"angle":[-6,20],"position":[-60,-110],"texture":[63],"doubleside":true,"bump":{"position":30,"size":15},"offset":{"x":5,"y":-20,"z":5}},"shields":{"doubleside":true,"offset":{"x":-20,"y":60,"z":10},"length":[0,30],"width":[65,65,30],"angle":[90,90],"position":[-40,-40,0,10],"texture":[3],"bump":{"position":0,"size":4}},"spoiler":{"length":[20,15,0,5],"width":[25,25,20,30,0],"angle":[0,20,90,90],"position":[60,60,75,75,85],"texture":[4,1,63],"doubleside":true,"bump":{"position":30,"size":5},"offset":{"x":0,"y":-10,"z":30}}},"typespec":{"name":"Astral Accelerator","level":1,"model":2,"code":202,"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[200,200],"reload":[19,29]},"ship":{"mass":200,"speed":[310,310],"rotation":[70,70],"acceleration":[90,90],"dash":{"rate":2,"burst_speed":[250,250],"speed":[400,400],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"shape":[4.058,4.112,4.235,4.267,1.924,1.754,1.458,1.331,1.542,1.537,1.47,1.431,1.425,1.456,1.513,1.601,1.725,1.905,2.132,2.253,2.37,2.488,2.609,2.329,1.985,1.954,1.985,2.329,2.609,2.488,2.37,2.253,2.132,1.905,1.725,1.601,1.513,1.456,1.425,1.431,1.47,1.537,1.542,1.331,1.458,1.754,1.924,4.267,4.235,4.112],"lasers":[],"radius":4.267,"next":[]}}';

var V2_103 = '{"name":"V2","designer":"Void","level":1,"model":3,"size":1.5,"zoom":0.7,"next":[],"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[200,200],"reload":[19,29]},"ship":{"mass":220,"speed":[305,305],"rotation":[70,70],"acceleration":[95,95],"dash":{"rate":2,"burst_speed":[250,250],"speed":[400,400],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":-10,"z":10},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-90,-75,-20,0,45,76,95,85],"z":[0,0,0,0,0,0,0,0]},"width":[0,15,20,25,25,25,20,0],"height":[0,10,20,20,20,20,15,0],"propeller":true,"texture":[63,2,2,10,2,4,17],"vertical":false},"topDetail":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":48,"z":29.8},"position":{"x":[3,-2,3,-2,4,1,-2],"y":[-30,-10,-10,5,5,15,15],"z":[0,0,0,0,0,0,0]},"width":[0,8,8,9,10,11,0],"height":[0,1,1,1,1,1,0],"propeller":false,"texture":[4],"angle":0,"vertical":false},"hundredpercentlegitname":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":20,"z":29},"position":{"x":[-5,-5,0,0,-5,-5],"y":[-25,-25,-15,15,25,25],"z":[-8,-8,-2,-2,-8,-8]},"width":[0,2,5,5,2,0],"height":[0,3,5,5,3,0],"texture":[4,4,3,4,4],"propeller":false,"angle":90},"hundredpercentlegitname2":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":65,"z":29},"position":{"x":[-5,-5,0,0,-5,-5],"y":[-25,-25,-15,15,25,25],"z":[-8,-8,-2,-2,-8,-8]},"width":[0,2,5,5,2,0],"height":[0,3,5,5,3,0],"texture":[4,4,3,4,4],"propeller":false,"angle":-90},"thingydetailsinbetween_insider":{"section_segments":[45,135,225,315],"offset":{"x":12,"y":42.5,"z":29},"position":{"x":[0,0,0,0,0,0],"y":[-25,-25,-25,20,20,20],"z":[0,0,0,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":0},"thingydetailsinbetween2_insider":{"section_segments":[45,135,225,315],"offset":{"x":21,"y":45,"z":23.5},"position":{"x":[0,0,0,0,0,0],"y":[-15,-15,-15,20,20,20],"z":[0,0,0,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"engineDetailTop":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":83.5,"z":30},"position":{"x":[0,0,0,0,0,0],"y":[-4,-4,-4,15,15,15],"z":[-5.5,-5.5,-5.5,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"engineDetailSides_Far":{"section_segments":[45,135,225,315],"offset":{"x":17,"y":83.5,"z":23.4},"position":{"x":[3,3,3,0,0,0],"y":[-4,-4,-4,17,17,17],"z":[-3,-3,-3,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"engineDetailSides_Farther":{"section_segments":[45,135,225,315],"offset":{"x":24.8,"y":83.5,"z":10},"position":{"x":[5.5,5.5,5.5,0,0,0],"y":[-4,-4,-4,17,17,17],"z":[0,0,0,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-30,"z":18},"position":{"x":[0,0,0,0,0,0,0],"y":[-50,-30,10,30,40],"z":[0,0,2,2,2]},"width":[0,10,16,15,5],"height":[0,9,12.5,12.5,2.5],"propeller":false,"texture":9},"deco":{"section_segments":6,"offset":{"x":23,"y":10,"z":10},"position":{"x":[1,1,3,7.5,10,10,10],"y":[-45,-50,-20,0,20,70,65],"z":[0,0,0,0,0,0,0]},"width":[0,7,10,10,15,10,0],"height":[0,7,10,10,10,8,0],"angle":0,"propeller":true,"texture":[4,3,4,10,4,17]},"top_props":{"section_segments":6,"offset":{"x":33,"y":30,"z":20},"position":{"x":[-6,-6,-3,0,0,0,0],"y":[-30,-40,-20,0,30,45,43],"z":[-5,-5,-1,0,0,1,1]},"width":[0,5,6,10,10,7.5,0],"height":[0,5,5,5,5,4,0],"angle":0,"propeller":true,"texture":[4,4,10,4,63,17]},"bottom_props":{"section_segments":6,"offset":{"x":33,"y":30,"z":0},"position":{"x":[-6,-6,-3,0,0,0,0],"y":[-30,-40,-20,0,30,45,43],"z":[5,5,1,0,0,-1,-1]},"width":[0,5,6,10,10,7.5,0],"height":[0,5,5,5,5,4,0],"angle":0,"propeller":true,"texture":[4,4,10,4,63,17]},"disc1":{"section_segments":20,"offset":{"x":33,"y":31.5,"z":15},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,7,7,7,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[11,11,11,12,12,12,12,11,11,11],"height":[11,11,11,12,12,12,12,11,11,11],"texture":[8]},"disc2":{"section_segments":20,"offset":{"x":33,"y":41.5,"z":15},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,7,7,7,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[11,11,11,12,12,12,12,11,11,11],"height":[11,11,11,12,12,12,12,11,11,11],"texture":[7]},"disc3":{"section_segments":20,"offset":{"x":33,"y":51.5,"z":15},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,7,7,7,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[11,11,11,12,12,12,12,11,11,11],"height":[11,11,11,12,12,12,12,11,11,11],"texture":[8]},"disc1_1":{"section_segments":8,"offset":{"x":0,"y":81,"z":10},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,7,7,7,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[19,19,19,20,20,20,20,19,19,19],"height":[14,14,14,15,15,15,15,14,14,14],"texture":[13]},"disc2_2":{"section_segments":8,"offset":{"x":0,"y":88,"z":10},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,0.2,0.2,0.2,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[19,19,19,20,20,20,20,19,19,19],"height":[14,14,14,15,15,15,15,14,14,14],"texture":[17]}},"wings":{"top":{"length":[50,40],"width":[80,50,30],"angle":[5,120],"position":[30,50,80],"doubleside":true,"bump":{"position":30,"size":7},"texture":[11,63],"offset":{"x":20,"y":-10,"z":10}},"topdetails":{"length":[55],"width":[80,50],"angle":[0],"position":[30,55],"doubleside":true,"bump":{"position":30,"size":5},"texture":[17],"offset":{"x":15,"y":-18,"z":10}},"bottom":{"length":[50,40],"width":[80,50,30],"angle":[-5,-120],"position":[30,50,80],"doubleside":true,"bump":{"position":30,"size":7},"texture":[11,63],"offset":{"x":20,"y":-10,"z":10}},"connectors":{"length":[10],"width":[50,50],"angle":[90],"position":[0,0],"doubleside":true,"bump":{"position":30,"size":6},"texture":[11],"offset":{"x":71,"y":40,"z":6}}},"typespec":{"name":"V2","level":1,"model":3,"code":203,"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[200,200],"reload":[19,29]},"ship":{"mass":220,"speed":[305,305],"rotation":[70,70],"acceleration":[95,95],"dash":{"rate":2,"burst_speed":[250,250],"speed":[400,400],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"shape":[3,2.826,2.462,1.711,1.42,1.501,1.433,1.298,1.205,1.14,1.217,1.369,1.589,1.95,2.199,2.29,2.447,2.691,2.888,2.872,2.93,2.956,2.652,2.713,2.694,2.651,2.694,2.713,2.652,2.956,2.93,2.872,2.888,2.691,2.447,2.29,2.199,1.95,1.605,1.369,1.217,1.14,1.205,1.298,1.433,1.501,1.42,1.711,2.462,2.826],"lasers":[],"radius":3,"next":[]}}';

var RAD_Diamond_Lancer_104 = '{"name":"Diamond Lancer","designer":"Uranus","level":1,"model":4,"size":1.98,"zoom":0.69,"next":[],"specs":{\
"shield":{"capacity":[240,400],"reload":[400,400]},"generator":{"capacity":[240,240],"reload":[19,29]},"ship":{"mass":230,"speed":[300,300],"rotation":[70,70],"acceleration":[95,95],"dash":{"rate":2,"burst_speed":[250,250],"speed":[400,400],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"bodies":{"main":{"section_segments":6,"offset":{"x":0,"y":-50,"z":0},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-53,-50,-40,-20,10,40,80,84],"z":[0,0,0,0,0,0,0,0]},"width":[18,25,25,23,23,25,20,0],"height":[0,5,10,10,10,10,7,0],"texture":[1,1,1,1,1,8,3.9],"angle":0},"bumper":{"section_segments":6,"offset":{"x":-1,"y":-100,"z":0},"position":{"x":[1.5,1,0,-5,-5,0,0],"y":[0,10,15,25,27],"z":[0,0,0,0,0,0,0]},"width":[5,5,5,5,0],"height":[5,5,5,5,0],"texture":[3.9,16.9,3.9],"angle":90},"cockpitWindshield":{"section_segments":3,"offset":{"x":0,"y":-40,"z":10},"position":{"x":[-20,0,5,0,-20,0,0],"y":[-20,-10,0,10,20],"z":[-6,-2,0,-2,-6,0,0]},"width":[0,12,12,12,0],"height":[0,5,5,5,0],"texture":[8.6],"angle":90},"cockpitBack":{"section_segments":6,"offset":{"x":0,"y":10,"z":7},"position":{"x":[0,0,0,0,0,0,0],"y":[-50,-20,0,20,23],"z":[-2,0,0,0,0,0,0]},"width":[15,15,15,13,0],"height":[0,10,10,10,0],"texture":[4,10,17.9,3.9],"angle":0},"cockpitBackSides":{"section_segments":6,"offset":{"x":13,"y":0,"z":7},"position":{"x":[5,0,0,0,0,0,0],"y":[-20,-10,0,3],"z":[-3,0,0,0,0,0,0]},"width":[0,7,7,0],"height":[0,5,5,0],"texture":[4,17.5,4,3],"angle":0},"enginesTop":{"section_segments":6,"offset":{"x":12,"y":70,"z":7},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-60,-58,-55,-40,-30,-25,-20,-8,-30],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,5,7,7,5,5,8,6,0],"height":[0,5,7,7,5,5,8,6,0],"texture":[3.9,3.9,10.4,63,2.9,2.9,3.9,16.9],"angle":0,"propeller":true},"enginesBottom":{"section_segments":6,"offset":{"x":18,"y":65,"z":-5},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-55,-54,-50,-40,-30,-25,-20,-8,-30],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,5,7,7,5,5,8,6,0],"height":[0,5,7,7,5,5,8,6,0],"texture":[3.9,3.9,17.9,63,2.9,2.9,3.9,16.9],"angle":0,"propeller":true},"enginesConnect":{"section_segments":6,"offset":{"x":1,"y":36,"z":0},"position":{"x":[4,-12,0,0,0,0,0],"y":[-20,10],"z":[-5,8,0,0,0,0,0]},"width":[2,2],"height":[2,2],"texture":[1.9],"angle":90},"boostTank":{"section_segments":12,"offset":{"x":0,"y":-15,"z":0},"position":{"x":[-30,-30,-30,-30,-30,-30,-30,-30,-30,-30],"y":[-30,-30,-26,-20,-5,5,20,26,30,30],"z":[0,0,0,0,0,0,0,0,0,0,0,0]},"width":[0,5,7.5,8,8,8,8,7.5,5,0],"height":[0,5,7.5,8,8,8,8,7.5,5,0],"texture":[63,63,63,13,4,13,63,63,63],"angle":0},"boostTankHolder":{"section_segments":6,"angle":90,"offset":{"x":0,"y":-15,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-44,-43,-39,-38,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,6,8,4,4],"height":[0,4,6,4,4],"texture":[4,63,4,4,4,4,4,63,4]},"boostPipeMain":{"section_segments":6,"offset":{"x":0,"y":-20,"z":11},"position":{"x":[-30,-30,-30,-30,-27,-15,-15,0,0],"y":[-20,-18,-15,30,35,45,48],"z":[-6,-2,0,0,0,0,0,0]},"width":[2,2,2,2,2,2,0],"height":[2,2,2,2,2,2,0],"texture":[63],"angle":0},"boostPipeSide":{"section_segments":6,"offset":{"x":0,"y":-20,"z":9},"position":{"x":[-34,-34,-34,-34,-36,-40,-42,-42,-42],"y":[-20,-18,-15,25,30,33,40,46],"z":[-6,-2,0,0,0,0,0,0]},"width":[2,2,2,2,2,2,2,0],"height":[2,2,2,2,2,2,2,0],"texture":[63],"angle":0},"boostTankEngineHolder":{"section_segments":6,"angle":90,"offset":{"x":0,"y":27,"z":3},"position":{"x":[0,0,0,0,10,0,0,0,0],"y":[-54,-53,-49,-48,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,6,8,3,3],"height":[0,4,6,3,3],"texture":[4,63,4,4,4,4,4,63,4]},"engineBoostTankOffset":{"section_segments":6,"offset":{"x":0,"y":70,"z":3},"position":{"x":[-42,-42,-42,-42,-42,-42,-42,-42,-42],"y":[-60,-58,-55,-40,-30,-25,-20,-8,-30],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,5,7,7,5,5,8,6,0],"height":[0,5,7,7,5,5,8,6,0],"texture":[3.9,3.9,10.4,63,2.9,2.9,3.9,16.9],"angle":0,"propeller":true},"logo1":{"section_segments":4,"offset":{"x":0,"y":-65,"z":11},"position":{"x":[0,0,0,0,0,0,0],"y":[0,5],"z":[0,0,0,0,0,0,0]},"width":[0,3.2],"height":[0,0],"texture":[4,3,4,3],"angle":0},"logo2":{"section_segments":4,"offset":{"x":0.1,"y":-65,"z":11},"position":{"x":[0,0,0,0,0,0,0],"y":[0,5],"z":[0,0,0,0,0,0,0]},"width":[0,3.2],"height":[0,0],"texture":[4,3,4,3],"angle":120},"logo3":{"section_segments":4,"offset":{"x":0.1,"y":-65,"z":11},"position":{"x":[0,0,0,0,0,0,0],"y":[5,15],"z":[0,-3,0,0,0,0,0]},"width":[3.2,0],"height":[0,0],"texture":[4],"angle":60},"logo4":{"section_segments":4,"offset":{"x":0,"y":-65,"z":11},"position":{"x":[0,0,0,0,0,0,0],"y":[5,15],"z":[0,0,0,0,0,0,0]},"width":[3.2,0],"height":[0,0],"texture":[4],"angle":180},"logoDeco":{"section_segments":4,"offset":{"x":5,"y":-72,"z":9},"position":{"x":[0,0,3,5,8,13,14,15],"y":[-20,-10,2,5,8,14,20,26],"z":[-4,0,-1,-1,-1,-2,-3,-3,0]},"width":[3,3,3,3,3,3,2,0,0],"height":[2,2,2,2,2,1,0,0],"texture":[3.9],"angle":0}},"wings":{"cockpitTop":{"doubleside":false,"offset":{"x":0,"y":-30,"z":15},"length":[10,13],"width":[30,20,4],"angle":[-11,-42],"position":[0,0,11],"texture":[11.5,9],"bump":{"position":20,"size":3}},"cockpitTopBack":{"doubleside":false,"offset":{"x":0,"y":-17,"z":14.8},"length":[10,13],"width":[10,10,20],"angle":[-11,-42],"position":[0,0,10],"texture":[4],"bump":{"position":20,"size":3}},"wingsBackTop":{"doubleside":true,"offset":{"x":14,"y":37,"z":10},"length":[20],"width":[20,7],"angle":[20],"position":[0,20],"texture":[63],"bump":{"position":20,"size":5}},"wingsBackBottom":{"doubleside":true,"offset":{"x":20,"y":31,"z":-8},"length":[30],"width":[16,4],"angle":[-25],"position":[0,20],"texture":[63],"bump":{"position":20,"size":5}}},"typespec":{"name":"Diamond Lancer","level":1,"model":4,"code":104,"specs":{\
"shield":{"capacity":[240,400],"reload":[400,400]},"generator":{"capacity":[240,240],"reload":[19,29]},"ship":{"mass":230,"speed":[300,300],"rotation":[70,70],"acceleration":[95,95],"dash":{"rate":2,"burst_speed":[250,250],"speed":[400,400],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"shape":[4.191,4.186,4.097,2.552,1.844,1.499,1.287,1.14,1.042,0.973,0.913,0.862,0.83,0.814,0.816,0.838,1.041,1.176,1.305,2.81,2.563,2.725,2.441,2.548,2.499,1.795,2.499,2.548,2.441,2.907,3.086,2.967,2.517,2.456,2.419,2.045,1.873,1.516,1.517,1.768,1.855,1.881,1.858,2.061,2.234,2.258,2.11,2.552,4.097,4.186],"lasers":[],"radius":4.191,"next":[]}}';

var Vengar_105 = '{"name":"Vengar","designer":"SChickenman","level":1,"model":5,"size":1.6,"zoom":0.72,"next":[],"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[200,200],"reload":[19,29]},"ship":{"mass":230,"speed":[290,290],"rotation":[95,95],"acceleration":[125,125],"dash":{"rate":2,"burst_speed":[250,250],"speed":[400,400],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"bodies":{"main":{"section_segments":6,"offset":{"x":0,"y":0,"z":-5},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0],"y":[-90,-70,-45,-25,-10,20,35,50,55,50],"z":[-4,-3,-2,-2,-2,0,0,0,0,0,0]},"width":[0,5,10,13,15,15,15,13,9,0],"height":[0,5,10,13,15,15,15,13,9,0],"texture":[1,1,63,63,1,1,63,12,17],"propeller":true},"cockpit":{"section_segments":6,"offset":{"x":0,"y":-15,"z":0},"position":{"x":[0,0,0,0,0,0],"y":[-45,-40,-25,0,20,45],"z":[-2,-2,0,2,5,8]},"width":[0,5,8,10,8,0],"height":[0,5,8,10,8,0],"texture":[4,9,9,10,4]},"cannon":{"section_segments":8,"offset":{"x":0,"y":-15,"z":-20},"position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-85,-80,-70,-80,-75,-20,0,20,50],"z":[0,0,0,0,0,0,0,0,10,30]},"width":[0,5,7.5,10,12.5,15,40,35,15],"height":[0,5,7.5,10,12.5,12.5,10,10,0],"angle":0,"propeller":false,"texture":[12,12,17,17,3,3]},"cannons2":{"section_segments":8,"offset":{"x":50,"y":70,"z":5},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0],"y":[-30,-15,-25,-15,-10,0,20,30,25],"z":[0,0,0,0,0,0,0,0,0,0,0]},"width":[0,5,7.5,10,10,10,10,7.5,0],"height":[0,5,7.5,10,10,10,10,7.5,0],"texture":[12,17,4,17,4,1,12,17],"propeller":true,"angle":0},"propulsors":{"section_segments":8,"offset":{"x":65,"y":-50,"z":-35},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0],"y":[30,45,35,45,50,95,100,90,95],"z":[0,0,0,0,0,0,0,0,0,0,0]},"width":[0,5,7.5,10,10,10,7.5,0],"height":[0,5,7.5,10,10,10,7.5,0],"texture":[12,17,4,17,63,11,12,17],"propeller":true}},"wings":{"wings1":{"doubleside":true,"offset":{"x":0,"y":20,"z":-13},"length":[0,-10,-30,-20],"width":[50,50,130,80,30],"angle":[100,-20,10,-20],"position":[-10,-10,-50,3,30],"texture":[4,4,4,1],"bump":{"position":50,"size":-5}},"join":{"doubleside":true,"offset":{"x":0,"y":0,"z":-10},"length":[70],"width":[50,30],"angle":[-20],"position":[0,20,0,50],"texture":63,"bump":{"position":10,"size":10}},"side_joins":{"doubleside":true,"offset":{"x":0,"y":30,"z":-3},"length":[20,7.5,20,20],"width":[90,65,55,30],"angle":[10,10,10,10],"position":[-50,-10,10,50],"texture":[8,63,4],"bump":{"position":10,"size":5}},"turbo_boi1":{"doubleside":true,"offset":{"x":0,"y":-80,"z":-20},"length":[10],"width":[30,30],"angle":[0],"position":[0,0],"texture":[4],"bump":{"position":10,"size":10}},"turbo_boi2":{"doubleside":true,"offset":{"x":0,"y":-80,"z":-20},"length":[10],"width":[30,30],"angle":[120],"position":[0,0],"texture":[4],"bump":{"position":10,"size":20}},"turbo_boi3":{"doubleside":true,"offset":{"x":0,"y":-80,"z":-20},"length":[10],"width":[30,30],"angle":[-120],"position":[0,0],"texture":[4],"bump":{"position":10,"size":20}}},"typespec":{"name":"Vengar","level":1,"model":5,"code":205,"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[200,200],"reload":[19,29]},"ship":{"mass":230,"speed":[290,290],"rotation":[95,95],"acceleration":[125,125],"dash":{"rate":2,"burst_speed":[250,250],"speed":[400,400],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"shape":[3.2,3.057,2.588,2.152,1.877,1.687,1.557,1.464,1.405,1.369,2.181,2.384,2.405,2.419,2.475,2.576,2.734,2.818,2.722,3.009,3.533,3.691,3.536,1.691,1.778,1.763,1.778,1.691,3.536,3.691,3.533,3.009,2.722,2.818,2.734,2.576,2.475,2.419,2.405,2.384,2.181,1.369,1.405,1.464,1.557,1.687,1.877,2.152,2.588,3.057],"lasers":[],"radius":3.691,"next":[]}}';

var Space_Phantom_106 = '{"name":"Space Phantom","level":1,"model":6,"size":1,"designer":"Goldman","zoom":0.8,"next":[],"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[300,300],"reload":[19,29]},"ship":{"mass":185,"speed":[290,290],"rotation":[110,110],"acceleration":[115,115],"dash":{"rate":2,"burst_speed":[250,250],"speed":[400,400],"acceleration":[100,100],"initial_energy":[60,60],"energy":[100,100]}}},"bodies":{"detail1":{"section_segments":[45,135,225,-90,315],"offset":{"x":0,"y":-50,"z":0},"position":{"x":[1,1,1,1,1,1,1,18,23,27,32,32],"y":[-80,-80,-65,-55,-45,-30,20,40,50,60,70,70],"z":[-13,-13,-7,-2,0,0,0,-1,-2,-5,-8,-8]},"width":[0,12,25,27,27,25,25,10,7,6,3,0],"height":[0,3,9,12,11,11,11,11,8,6,3,0],"texture":[1,1,1,1,1,1,1,1,63],"propeller":false,"vertical":false,"angle":0},"detail2":{"section_segments":[45,90,135,225,315],"offset":{"x":0,"y":-50,"z":0},"position":{"x":[-1,-1,-1,-1,-1,-1,-1,-18,-23,-27,-32,-32],"y":[-80,-80,-65,-55,-45,-30,20,40,50,60,70,70],"z":[-13,-13,-7,-2,0,0,0,-1,-2,-5,-8,-8]},"width":[0,12,25,27,27,25,25,10,7,6,3,0],"height":[0,3,9,12,11,11,11,11,8,6,3,0],"texture":[1,1,1,1,1,1,1,1,63],"propeller":false,"vertical":false,"angle":0},"detail3":{"section_segments":[20,60,100,140,180,220,260,300,340,20],"offset":{"x":0,"y":-15,"z":122},"position":{"x":[0,0,0,0,0,0],"y":[-8,-8,-4,2,5,5],"z":[0,0,0,0,-3,-3]},"width":[0,23,23,20,10,0],"height":[0,40,40,35,15,0],"texture":[1,1,63,1],"propeller":false,"vertical":true,"angle":0},"detail4":{"section_segments":[45,135,225,315],"offset":{"x":1,"y":-50,"z":-12},"position":{"x":[0,0,0,0,0,0,0,0,0,20,29,29],"y":[-79,-79,-65,-50,-35,-25,-15,-5,15,42,65,65],"z":[-6,-6,-6,-1,0,0,0,-2,-3.5,2,2,2]},"width":[0,13,31,33,30,26,26,30,32,5,3,0],"height":[0,4,10,22,22,22,25,25,25,15,3,0],"texture":[4],"propeller":false,"vertical":false,"angle":0},"detail5":{"section_segments":[45,90,135,225,315],"offset":{"x":0,"y":40,"z":-10},"position":{"x":[0,0,-2,0,0,0],"y":[-60,-60,-20,15,50,50],"z":[0,0,0,0,0,0]},"width":[0,21,26,20,18,0],"height":[0,24,13,12,12,0],"texture":[4,4,4,1,1,1],"propeller":false,"vertical":false,"angle":0},"detail6":{"section_segments":[45,90,135,225,315],"offset":{"x":0,"y":40,"z":-10},"position":{"x":[0,0,0,-2,0,0],"y":[-50,-50,-15,20,60,60],"z":[0,0,0,0,0,0]},"width":[0,18,20,26,21,0],"height":[0,12,12,13,24,0],"texture":[4,1,4,4,4],"propeller":false,"vertical":false,"angle":180},"detail7":{"section_segments":6,"offset":{"x":1,"y":-100,"z":9},"position":{"x":[-1,-1,-1,-1,-1,13,14,13,13],"y":[-50,-50,-35,-15,5,20,50,70,70],"z":[-25,-25,-23,-9,-2,0,0,-3,-3]},"width":[0,7,15,20,22,6,3,2,0],"height":[0,2,15,12,8,2,2,2,0],"texture":[9,9,9,9,7,4],"propeller":false,"vertical":false,"angle":0},"detail8":{"section_segments":6,"offset":{"x":40,"y":100,"z":-15},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-50,-50,-40,-10,40,50,40,40],"z":[0,0,0,0,0,0,0,0]},"width":[0,12,15,15,15,12,5,0],"height":[0,12,15,15,15,12,5,0],"texture":[4,4,4,4,4,17],"propeller":true,"vertical":false,"angle":0},"detail9":{"section_segments":[45,135,225,315],"offset":{"x":55,"y":-15,"z":-85},"position":{"x":[-7,-7,-3,0,0,-7,-7],"y":[-12,-12,-9,-6,1.5,15,15],"z":[0,0,0,-2,-25,-35,-45]},"width":[0,4,4,4,4,4,0],"height":[0,44,48,49,20,16,0],"texture":[1],"propeller":false,"vertical":true,"angle":0},"detail10":{"section_segments":6,"offset":{"x":49,"y":45,"z":-18},"position":{"x":[-3,-3,0,0,0,0],"y":[-25,-25,-20,20,25,25],"z":[0,0,0,0,0,0]},"width":[0,5,8,8,5,0],"height":[0,5,8,8,5,0],"texture":[1,1,63,1],"propeller":false,"vertical":false,"angle":0},"detail11":{"section_segments":[45,135,225,315],"offset":{"x":45,"y":-15,"z":-18},"position":{"x":[0,0,0,0,0,0,0],"y":[0,0,-41,-40,-28,40,40],"z":[0,0,0,0,0,0,0]},"width":[0,2,2,3.5,3.5,3.5,0],"height":[0,2,2,3.5,3.5,3.5,0],"texture":[4,4,4,17,4],"propeller":false,"vertical":false,"angle":0},"detail12":{"section_segments":6,"offset":{"x":0,"y":95,"z":-50},"position":{"x":[0,0,0,-40,-55,-55],"y":[45,45,55,95,110,110],"z":[24,24,24,0,-8,-8]},"width":[0,35,35,23,18,0],"height":[0,6,6,3,2,0],"texture":[0.2,0.2,0.2,63],"propeller":false,"vertical":false,"angle":90},"detail13":{"section_segments":6,"offset":{"x":0,"y":95,"z":-50},"position":{"x":[0,0,0,40,55,55],"y":[45,45,55,95,110,110],"z":[24,24,24,0,-8,-8]},"width":[0,35,35,23,18,0],"height":[0,6,6,3,2,0],"texture":[0.2,0.2,0.2,63],"propeller":false,"vertical":false,"angle":-90},"detail14":{"section_segments":[20,60,100,140,180,220,260,300,340,20],"offset":{"x":0,"y":0,"z":-110},"position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-6,-6,-4,2,5,-2,-2,-2],"z":[0,0,0,0,-3,-3,-3,-3,-3]},"width":[0,40,40,35,20,25,16,0],"height":[0,40,40,35,20,25,16,0],"texture":[0.9,0.9,63,0.9,3.9,16.9,3.9],"propeller":false,"vertical":true,"angle":0},"detail15":{"section_segments":6,"offset":{"x":0,"y":140,"z":-18},"position":{"x":[0,0,0,0,0,0,0],"y":[-50,-50,-8,15,30,20,20],"z":[0,0,0,0,0,0,0]},"width":[0,25,25,25,18,8,0],"height":[0,16,15,15,12,5,0],"texture":[3.9,3.9,0.9,3.9,16.9],"propeller":true,"vertical":false,"angle":0},"detail16":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":-63,"z":4},"position":{"x":[0,0,0,0,0],"y":[-25,-25,-20,30,30],"z":[0,0,0,0,0]},"width":[0,17,17,17,0],"height":[0,6,6,6,0],"texture":[1,1,10.4444,1],"propeller":false,"vertical":false,"angle":0},"detail17":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":10,"z":3},"position":{"x":[0,0,0,0,0,0,0],"y":[-30,-30,-20,30,40,70,70],"z":[0,0,0,-8,-8,-8,-8]},"width":[0,12,17,17,10,10,0],"height":[0,6,6,12,6,6,0],"texture":[3,3,8,63,15,3],"propeller":false,"vertical":false,"angle":0},"detail18":{"section_segments":6,"offset":{"x":58,"y":100,"z":-29},"position":{"x":[0,0,0,0,0,0],"y":[-35,-35,-30,30,35,35],"z":[0,0,0,0,0,0]},"width":[0,5,8,8,5,0],"height":[0,5,8,8,5,0],"texture":[3.9,3.9,11,3.9,3.9],"propeller":false,"vertical":false,"angle":0},"detail19":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":-150,"z":-20},"position":{"x":[0,0,0,0,0,0],"y":[-10,-10,-13,-10,15,15],"z":[0,0,0,0,0,0]},"width":[0,5,7,10,10,0],"height":[0,1,2,4,4,0],"texture":[4,4,17,17],"propeller":false,"vertical":false,"angle":0}},"typespec":{"name":"Space Phantom","level":1,"model":6,"code":206,"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[300,300],"reload":[19,29]},"ship":{"mass":185,"speed":[290,290],"rotation":[110,110],"acceleration":[115,115],"dash":{"rate":2,"burst_speed":[250,250],"speed":[400,400],"acceleration":[100,100],"initial_energy":[60,60],"energy":[100,100]}}},"shape":[3.262,3.138,2.418,1.682,1.217,1.453,1.455,1.302,1.17,1.083,1.019,0.978,0.956,0.957,0.98,1.017,1.275,1.382,1.584,2.817,3.976,3.77,3.165,3.154,3.414,3.407,3.414,3.154,3.165,3.77,3.976,2.817,1.584,1.382,1.275,1.017,0.98,0.957,0.956,0.978,1.019,1.083,1.17,1.302,1.455,1.453,1.217,1.682,2.418,3.138],"lasers":[],"radius":3.976,"next":[]}}';

var ships = {
  Booster_101,
  Astral_Accelerator_102,
  V2_103,
  RAD_Diamond_Lancer_104,
  Vengar_105,
  Space_Phantom_106,
};

var starting_ship = { Vengar_105 };

var ship_params = {
  [vehicles.sprint]: {
    Booster_101:            { dash_speed: 600, dash_acceleration: 100 },
    Astral_Accelerator_102: { dash_speed: 550, dash_acceleration: 100 },
    V2_103:                 { dash_speed: 550, dash_acceleration: 100 },
    RAD_Diamond_Lancer_104: { dash_speed: 550, dash_acceleration: 100 },
    Vengar_105:             { dash_speed: 550, dash_acceleration: 100 },
    Space_Phantom_106:      { dash_speed: 500, dash_acceleration: 150 },
  }
};

var ship_levels = {
  [vehicles.sprint]:    1,
  [vehicles.endurance]: 2,
};


// Spectators

var Camera1_191 = '{"name":"Camera1","level":1.9,"model":1,"size":0.1,"zoom":0.11,"next":[],"specs":{"shield":{"capacity":[100,100],"reload":[100,100]},"generator":{"capacity":[1,1],"reload":[1,1]},\
"ship":{"mass":400,"speed":[1300,1300],"rotation":[200,200],"acceleration":[50,50]}},"typespec":{"name":"Camera1","level":3,"model":1,"code":301,"specs":{"shield":{"capacity":[100,100],"reload":[100,100]},"generator":{"capacity":[1,1],"reload":[1,1]},\
"ship":{"mass":400,"speed":[1300,1300],"rotation":[200,200],"acceleration":[50,50]}},"shape":[0],"lasers":[],"radius":0.01,"next":[]}}';

var Camera2_192 = '{"name":"Camera2","level":1.9,"model":2,"size":0.1,"zoom":0.105,"next":[],"specs":{"shield":{"capacity":[100,100],"reload":[100,100]},"generator":{"capacity":[1,1],"reload":[1,1]},\
"ship":{"mass":400,"speed":[1000,1000],"rotation":[200,200],"acceleration":[200,200]}},"typespec":{"name":"Camera2","level":3,"model":2,"code":301,"specs":{"shield":{"capacity":[100,100],"reload":[100,100]},"generator":{"capacity":[1,1],"reload":[1,1]},\
"ship":{"mass":400,"speed":[1000,1000],"rotation":[200,200],"acceleration":[200,200]}},"shape":[0],"lasers":[],"radius":0.01,"next":[]}}';

var spectators = {
  Camera1_191,
  Camera2_192,
};

var spectators_level = 1.9;


// Dummy ships

var Dummy_101 = '{"name":"Dummy",\
"level":1,"model":1,"size":1,"next":[],"specs":{"shield":{"capacity":[1,1],"reload":[1,1]},"generator":{"capacity":[1,1],"reload":[1,1]},"ship":{"mass":1,"speed":[1,1],"rotation":[1,1],"acceleration":[1,1]}},"typespec":{"name":"Dummy",\
"level":1,"model":1,"code":101,"specs":{"shield":{"capacity":[1,1],"reload":[1,1]},"generator":{"capacity":[1,1],"reload":[1,1]},"ship":{"mass":1,"speed":[1,1],"rotation":[1,1],"acceleration":[1,1]}},"shape":[0],"lasers":[],"radius":1,"next":[]}}';

var dummy_ship = { Dummy_101 };


// Tracks

var map_size = 100;

var AzeGP = {
  sname: "AZE",
  map: ""+
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //1
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //2
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //3
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //4
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //5
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //6
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //7
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //8
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //9
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+    //10
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //1
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //2
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //3
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //4
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //5
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //6
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //7
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //8
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //9
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+    //20
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //1
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //2
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //3
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //4
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //5
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //6
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //7
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //8
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //9
"9999999999999999999999999999999999999999999999999999999999999999                       L          99\n"+     //30
"999999999999999999   L   99999999999999999999999999999999999999                        L           9\n"+ //1
"99999999999999999    L    9999999999999999999999999999999999999      M              M  L           9\n"+ //2
"9999999999999999     L     999999999999999999999999999999999999                        L           9\n"+ //3
"999999999999999     99     999999999999999999999999999999999999                        L           9\n"+ //4
"99999999999999     9999    999999999999999999999999999999999999     99999999999999999999999999     9\n"+ //5
"9999999999999     99999    999999999999999999999999999999999999    9999999999999999999999999999    9\n"+ //6
"999999999999     9999999   999999999999999999999999999999999999    9999999999999999999999999999    9\n"+ //7
"99999999999DDDDD99999999UUU999999999999999999999999999999999999DDDD9999999999999999999999999999UUUU9\n"+ //8
"9999999999     999999999   999999999999999999999999999999999999    9999999999999999999999999999    9\n"+ //9
"999999999     9999999999   9999999999999999999999999999999999      9999999999999999999999999999    9\n"+    //40
"99999999      99999999999  999999999999999999999  L                9999999999999999999999999999    9\n"+ //1
"9999999      999999999999   9999999999999999999   L             9999999999999999999999999999999    9\n"+ //2
"999999DDDDDDD9999999999999UUU99999999999999999    L           999999999999999999999999999999999    9\n"+ //3
"999999      99999999999999    9999999999999       999999999999999999999999999999999999999999999    9\n"+ //4
"99999      999999999999999    999999999          9999999999999999999999999999999999999999999999    9\n"+ //5
"99999     9999999999999999    999999           999999999999999999999999999999999999999999999999UUUU9\n"+ //6
"99999     9999999999999999       L          99999999999999999999999999999999999999999999999999     9\n"+ //7
"99999    99999999999999999       L       999999999999                                              9\n"+ //8
"99999    999999999999999999      L   999999999999                B B B B B B B B B   R     R       9\n"+ //9
"99999D  D9999999999999999999999999999999999999                                        R     R      9\n"+    //50
"99999 DD 9999999999999999999999999999999999        T          T                    I  R     R      9\n"+ //1
"99999    9999999999999999999999999999999                          B B B B B B B B    R     R       9\n"+ //2
"99999    9999999999999999999999999999                           RRR                               99\n"+ //3
"99999     99999999999999999999999999         99999999+99999999   9999+999999999999999999999999999999\n"+ //4
"99999     9999999999999999999999999       9999999999999999999   999999999999999999999999999999999999\n"+ //5
"99999      99999999999999999999999       9999999999999999999      9999999999999999999999999999999999\n"+ //6
"999999      999999999999999999999       999999999999999            999999999999999999999999999999999\n"+ //7
"999999DDDDDDD9999999999999999999UUUUUUU999999999999999               9999999999999999999999999999999\n"+ //8
"9999999      999999999999999999       9999999999999999               9999999999999999999999999999999\n"+ //9
"99999999      9999999999999999       99999999999999999               9999999999999999999999999999999\n"+    //60
"999999999     999999999999999       999999999999999999               9999999999999999999999999999999\n"+ //1
"9999999999     9999999999999       9999999999999999999               9999999999999999999999999999999\n"+ //2
"99999999999     99999999999       9999999999999999999+999999999999999+999999999999999999999999999999\n"+ //3
"999999999999     999999999       9999999999999999999999999999999999999999999999999999999999999999999\n"+ //4
"9999999999999     9999999       99999999999999999999999999999999999999999999999999999999999999999999\n"+ //5
"99999999999999       R         999999999999999999999999999999999999999999999999999999999999999999999\n"+ //6
"999999999999999      R        9999999999999999999999999999999999999999999999999999999999999999999999\n"+ //7
"9999999999999999     R       99999999999999999999999999999999999999999999999999999999999999999999999\n"+ //8
"99999999999999999    R      999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //9
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+    //70
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //1
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //2
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //3
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //4
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //5
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //6
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //7
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //8
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //9
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+    //80
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //1
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //2
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //3
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //4
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //5
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //6
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //7
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //8
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //9
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+    //90
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //1
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //2
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //3
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //4
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //5
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //6
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //7
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //8
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //9
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999",

  checkpoints: [
    {x:330,y:5,direction:0,width:100}, // Start / finish line
    {x:75,y:85,direction:Math.PI,width:100}, // the 1st third end of track (2nd sector beginning)
    {x:-300,y:-165,direction:0,width:120} // the 2nd third end of track (3rd sector beginning)
  ],
  SpawnX: 120,
  SpawnY: -50,
  starting_grid: {
    y1: 15,
    y2: -15,
    x1: 309,
    next_y: x => Math.max(139, x - 10),
  },
};

var tracks = [
  AzeGP,
];

var current_track = 0;


// Main code

var map, checkpoints, map_lines, allow_ship_switch, pinned_ship, track_sname, starting_grid;
var SpawnX, SpawnY;

var ships_level = ship_levels[vehicle_type];

race_close_time *= 60;
ship_switch_delay *= 60;

var set_starting_grid = function(track) {
  starting_grid = track.starting_grid;
  starting_grid.angle = 180 * track.checkpoints[0].direction / Math.PI;
  if (typeof starting_grid.next_x === "function") {
    var x = starting_grid.x = [];
    x[1] = x[0] = starting_grid.x1;
    starting_grid.next_position = function() {
      x[1] = x[0] = starting_grid.next_x(x[0]);
    };
    starting_grid.y = [starting_grid.y1, starting_grid.y2];
  } else if (typeof starting_grid.next_y === "function") {
    var y = starting_grid.y = [];
    y[1] = y[0] = starting_grid.y1;
    starting_grid.next_position = function() {
      y[1] = y[0] = starting_grid.next_y(y[0]);
    };
    starting_grid.x = [starting_grid.x1, starting_grid.x2];
  } else {
    fatal_error(`Not found starting_grid.next_x / next_y function for track: ${track.sname}`);
  }
};

var setTrack = function(game, trackid) {
  var track = tracks[trackid];
  checkpoints = track.checkpoints;
  map = outlap.init_lap_map(track.map);
  game.setCustomMap(map);
  map_lines = map.split("\n");
  SpawnX = tracks[trackid].SpawnX;
  SpawnY = tracks[trackid].SpawnY;
  track_sname = track.sname;
  set_starting_grid(track);
  pinned_ship = track.pinned_ship;
  allow_ship_switch = !pinned_ship;
  if (pinned_ship > 0) {
    // consider shifted level 1 models (because of hidden starting ship 101)
    pinned_ship += ships_level*100 + model_shift;
  }
  game.removeObject();
  addObjects(game);
};


var scoreboard = {
  id:"scoreboard",
  visible: true,
  components: [
    { type:"box",position:[0,0,100,100],fill:"#456",stroke:"#CDE",width:2},
    { type: "text",position: [0,0,100,100],color: "#FFF",value: "My Text"}
  ]
};

var lap_info = {
  id:"lap_info",
  visible: true,
  position: [30,90,40,5],
  components: [
    { type: "text",position: [0,0,100,100],color: "#FFF",value: "Race for fastest lap"}
  ]
};

var race_info = {
  id:"race_info",
  visible: true,
  position: [30,5,40,5],
  components: [
    { type: "text",position: [0,0,100,100],color: "#FFF",value: "Qualification"}
  ]
};

var countdown = {
  id: "countdown",
  visible: true,
  position: [20.5,15,75,127.5],
  components: [
    { type:"round",position:[10,0,10,10],fill:"#ff0000",stroke:"#fff",width:2},
    { type:"round",position:[22,0,10,10],fill:"#ff0000",stroke:"#fff",width:2},
    { type:"round",position:[34,0,10,10],fill:"#ff0000",stroke:"#fff",width:2},
    { type:"round",position:[46,0,10,10],fill:"#ff0000",stroke:"#fff",width:2},
    { type:"round",position:[58,0,10,10],fill:"#ff0000",stroke:"#fff",width:2},
  ]
};


var change_button = {
  id: "change",
  position: [6,30,8,14],
  clickable: true,
  shortcut: "E",
  visible: true,
  components: [
    { type: "box",position:[0,0,100,100],stroke:"#CDE",width:2},
    { type: "text",position:[10,35,80,30],value:"Switch",color:"#CDE"},
    { type: "text",position:[20,70,60,20],value:"[E]",color:"#CDE"}
  ],
};

var change_button_hidden = {
  id: "change",
  position: [0,0,0,0],
  clickable: false,
  visible: false,
  components: [],
};

// TODO: implement spectator buttons

// var warp_button = {
  // id: "warp",
  // position: [16.4,19.5,8,14],
  // clickable: false,
  // shortcut: "U",
  // visible: true,
  // components: [
    // { type: "text",position:[10,35,80,30],value:"[W]to warp",color:"#CDE"},
  // ],
// };

// var change_camera = {
  // id: "change_camera",
  // position: [16.4,16.8,8,14],
  // clickable: false,
  // shortcut: "U",
  // visible: true,
  // components: [
    // { type: "text",position:[10,35,80,30],value:"[J]c.toggle",color:"#CDE"},
  // ],
// };

// var warpShip = function(ship) {
  // x =;
  // y =;
  // ship.set({x:x,y:y,vx:0,vy:0,invulnerable:180})
// };


// Track background, can be used on map pattern with shortcuts

var DRSMirror = {
  id: "DRSMirror",
  obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
  emissive: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/drsPS.png"
};

var DRSHoriz = {
  id: "DRSHooriz",
  obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
  emissive: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/drsPS.png"
};

var DRSZone = {
  id: "DRSZone",
  obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
  emissive: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/drsPS.png"
};

var startline = {
  id: "startline",
  obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
  emissive: "https://starblast.data.neuronality.com/mods/objects/startline.png"
};

var startblock = {
  id: "startblock",
  obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
  emissive: "https://starblast.data.neuronality.com/mods/objects/startblock.png"
};

var arrow = {
  id: "arrow",
  obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
  emissive: "https://starblast.data.neuronality.com/mods/objects/arrow.png"
};


// Track background without shortcuts

var ShipsGallery = {
  id: "ShipsGallery",
  obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
  diffuse: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/racingships2.png",
  emissive: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/racingships2.png"
};

var AboutMod = {
  id: "AboutMod",
  obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
  diffuse: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/aboutmod2.png",
  emissive: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/aboutmod2.png"
};

var TrackInfo = {
  id: "TrackInfo",
  obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
  diffuse: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/abouttrack"+ track_sname +".png",
  emissive: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/abouttrack"+ track_sname +".png"
};

var SRCLogo = {
  id: "SRCLogo",
  obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
  diffuse: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/RacingLOGO2.png",
  emissive: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/RacingLOGO2.png"
};

var SpawnAndSwitch = {
  id: "SpawnAndSwitch",
  obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
  diffuse: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/spawnandswitch.png",
  emissive: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/spawnandswitch.png"
};


// Background functions

var addSRCLogo = function(x, y) {
  game.setObject({
    id: `SRCLogo:${x}:${y}`,
    type: SRCLogo,
    position: {x:x,y:y,z:-2.5},
    scale: {x:25,y:25,z:36},
    rotation: {x:600,y:0,z:0}
  });
};

var show_spawn_switch = function(game) {
  if (!game.custom.spawn_switch) {
    game.custom.spawn_switch = true;
    game.setObject({
      id: "SpawnAndSwitch",
      type: SpawnAndSwitch,
      position: {x:SpawnX,y:SpawnY,z:-2.5},
      scale: {x:20,y:20,z:36},
      rotation: {x:600,y:0,z:0}
    });
  }
};

var hide_spawn_switch = function(game) {
  if (game.custom.spawn_switch) {
    game.custom.spawn_switch = false;
    game.removeObject("SpawnAndSwitch");
  }
};

var show_spawn_objects = function(game) {
  if (allow_ship_switch) {
    show_spawn_switch(game);
  }

  game.setObject({
    id: "ShipsGallery",
    type: ShipsGallery,
    position: {x:SpawnX+45,y:SpawnY-45,z:-2.5},
    scale: {x:49,y:49,z:36},
    rotation: {x:600,y:0,z:0}
  });

  game.setObject({
    id: "AboutMod",
    type: AboutMod,
    position: {x:SpawnX-5,y:SpawnY-45,z:-2.5},
    scale: {x:49,y:49,z:36},
    rotation: {x:600,y:0,z:0}
  });

  game.setObject({
    id: "TrackInfo",
    type: TrackInfo,
    position: {x:SpawnX-55,y:SpawnY-45,z:-2.5},
    scale: {x:49,y:49,z:36},
    rotation: {x:600,y:0,z:0}
  });
};

var hide_spawn_objects = function(game) {
  hide_spawn_switch(game);
  game.removeObject("ShipsGallery");
  game.removeObject("AboutMod");
  game.removeObject("TrackInfo");
};


var addObjects = function(game) {
  show_spawn_objects(game);

  // comment out first logo - it's badly rendering sometimes
  // TODO: check it later
  // var step = 50;
  // addSRCLogo(
    // checkpoints[0].x + step * Math.cos(checkpoints[0].direction),
    // checkpoints[0].y + step * Math.sin(checkpoints[0].direction)
  // );
  for (var i = 1; i < checkpoints.length; i++) {
    addSRCLogo(checkpoints[i].x, checkpoints[i].y);
  }

  for (var y=0;y<map_lines.length;y++)
  {
    var line = map_lines[y];

    for (var x=0;x<line.length;x++)
    {
      var px =  (x+0.5-map_size/2)*10;
      var py =  (map_size-y-1+0.5-map_size/2)*10;

      switch (line.charAt(x))
      {
        case "R":
          game.setObject({id: "R"+px+":"+py,
            type:arrow,
            position: {x:px,y:py,z:-2},
            scale: {x:6,y:6,z:6},
            rotation: {x:0,y:0,z:Math.PI/2}
          });
          break;
        case "U":
         game.setObject({id: "U"+px+":"+py,
            type:arrow,
            position: {x:px,y:py,z:-2},
            scale: {x:6,y:6,z:6},
            rotation: {x:0,y:0,z:Math.PI}
          });
          break;
        case "L":
         game.setObject({id: "L"+px+":"+py,
            type:arrow,
            position: {x:px,y:py,z:-2},
            scale: {x:6,y:6,z:6},
            rotation: {x:0,y:0,z:Math.PI*1.5}
          });
          break;
        case "D":
          game.setObject({id: "D"+px+":"+py,
            type:arrow,
            position: {x:px,y:py,z:-2},
            scale: {x:6,y:6,z:6},
            rotation: {x:0,y:0,z:0}
          });
          break;
        case "I":
          game.setObject({id: "I"+px+":"+py,
            type:startline,
            position: {x:px,y:py+5,z:-2},//PY+5!!!
            scale: {x:40,y:40,z:40},
            rotation: {x:0,y:0,z:Math.PI*0.5 + checkpoints[0].direction}
          });
          break;
        case "B":
          game.setObject({id: "B"+px+":"+py,
            type:startblock,
            position: {x:px,y:py,z:-2},
            scale: {x:6,y:6,z:6},
            rotation: {x:0,y:0,z:Math.PI*0.5 + checkpoints[0].direction}
          });
          break;
        case "T":
          game.setObject({id: "T"+px+":"+py,
            type: DRSZone,
            position: {x:px,y:py+5,z:-2},//PY+5!!!
            scale: {x:29,y:23,z:26},
            rotation: {x:Math.PI,y:0,z:Math.PI*0.5}
          });
          break;
        case "H":
          game.setObject({id: "H"+px+":"+py,
            type: DRSHoriz,
            position: {x:px,y:py,z:-2},
            scale: {x:33,y:25,z:26},
            rotation: {x:Math.PI,y:0,z:0}
          });
          break;
        case "M":
          game.setObject({id: "M"+px+":"+py,
            type: DRSMirror,
            position: {x:px,y:py,z:-2}, 
            scale: {x:29,y:23,z:26},
            rotation: {x:Math.PI,y:0,z:Math.PI*0.5}
          });
          break;
      }
    }
  }
};

var formatLapTime = function(time) {
  if (time>10000)
  {
    return "-";
  }
 time = Math.round(time*1000);
 var cents = time%1000;
 var seconds = Math.floor(time/1000)%60;
 var minutes = Math.floor(time/60000);
 if (cents<10) cents = "0"+cents;
 if (cents<100) cents = "0"+cents;
 if (seconds<10) seconds = "0"+seconds;
 return minutes+":"+seconds+":"+cents;
};

var formatMinutesSeconds = function(time) {
 var seconds = time%60;
 var minutes = Math.floor(time/60);
 if (seconds<10) seconds = "0"+seconds;
 return minutes+":"+seconds;
};


// Tools

var color_message, color_echo, color_name, color_echo_with_name, fatal_error, error;

if (public_event) {
  color_message = color_echo = color_name = color_echo_with_name = fatal_error = error = function() {
    return;
  }
} else {
  // Disable debug messages in terminal (tick time & data sent)
  game.modding.tick = function(t) {
    this.game.tick(t);
    if (this.context.tick != null) {
      this.context.tick(this.game);
    }
  };

  var echo = function(...args) {
    game.modding.terminal.echo(...args);
  };

  // Color terminal output

  var color_message = function(message, color, style) {
    if (!color) {
      color = "";
    }
    if (!style) {
      style = "";
    }
    return `[[${style};${color};]${message}]`;
  };

  var color_echo = function(message, color, style) {
    echo(color_message(message, color, style));
  };

  var color_name = function(index, name, color) {
    return color_message(index, color, "b") + color_message(" | ", color) + color_message(name, color, "b");
  };

  var color_echo_with_name = function(message, index, name, color) {
    echo(color_message(message + " ", color) + color_name(index, name, color));
  };

  var patch_error = function() {
    var modding = game.modding;
    if (!modding.terminal.error.old) {
      var error = function(message, options) {
        var stop;
        if (message instanceof Error) {
          var lines = message.stack.split("\n");
          message = lines[0] + "\n";
          var position = lines[1].match(/\<anonymous\>:(\d+):(\d+)\)$/);
          if (position) {
            message += `  at line: ${position[1]}, column: ${position[2]}\n`;
          }
          console.error(message);
          stop = !modding.field_view;
        } else {
          stop = modding.context && modding.context.stop;
        }
        error.old.call(this, message, options);
        if (stop) {
          modding.context = null;
          throw "Mod stopped";
        }
      };
      error.old = modding.terminal.error;
      modding.terminal.error = error;
    }
  };

  patch_error();

  var fatal_error = function(message) {
    if (!game.modding.field_view) {
      game.modding.context.stop = true;
    }
    throw "\nFatal Error: " + message + "\n";
  };

  var error = function(message) {
    game.modding.terminal.error("Error: " + message);
  };
}

// Instructor tools

var hide_race_info = function(ship) {
  if (race_info.forced) {
    return;
  }
  var visible = race_info.visible;
  race_info.visible = false;
  if (ship == null) {
    for (var ship of game.ships) {
      if (!ship.custom.hide_race_info) {
        ship.custom.hide_race_info = true;
        ship.setUIComponent(race_info);
      }
    }
  } else if (!ship.custom.hide_race_info) {
    ship.custom.hide_race_info = true;
    ship.setUIComponent(race_info);
  }
  race_info.visible = visible;
};

var show_race_info = function(ship) {
  if (ship == null) {
    for (var ship of game.ships) {
      if (ship.custom.hide_race_info) {
        ship.custom.hide_race_info = false;
        ship.setUIComponent(race_info);
      }
    }
  } else if (ship.custom.hide_race_info) {
    ship.custom.hide_race_info = false;
    ship.setUIComponent(race_info);
  }
};

var update_race_info = function(ship, forced) {
  race_info.forced = !!forced;
  if (ship == null) {
    for (var ship of game.ships) {
      if (forced || !ship.custom.hide_race_info) {
        ship.setUIComponent(race_info);
      }
    }
  } else if (forced || !ship.custom.hide_race_info) {
    ship.setUIComponent(race_info);
  }
};

var instructor_cleaner = function(message) {
  var newlines = 5;
  var i;
  for (i = 0; i < newlines && i < message.length; i++) {
    if (message[message.length - i - 1] != "\n") {
      break;
    }
  }
  return "\n".repeat(newlines - i);
};

// Global commands

var instructor = function(message, time = 15, character = "Lucina", cancel_old_action = false, timeout_action = null) {
  clearTimeout(game.custom.instructor_timer);
  for (var ship of game.ships) {
    clearTimeout(ship.custom.instructor_timer);
    ship.custom.instructor_timer = 0;
    ship.instructorSays(message, character);
  }
  hide_race_info();
  var cleaner = instructor_cleaner(message);
  game.custom.instructor_timer = setTimeout(function() {
    for (var ship of game.ships) {
      if (!ship.custom.instructor_timer) {
        if (cleaner.length > 0) {
          ship.instructorSays(cleaner, character);
        }
        ship.hideInstructor();
        show_race_info(ship);
      }
    }
  }, time * 1000);
  if (cancel_old_action) {
    clearTimeout(game.custom.instructor_action_timer);
  }
  if (typeof timeout_action === "function") {
    game.custom.instructor_action_timer = setTimeout(timeout_action, time * 1000);
  }
};

var find_ship = function(ship) {
  var ship_number = -1;
  if (typeof ship === "number") {
    ship_number = ship;
    ship = game.ships[ship-1];
    if (ship == null) {
      error(`Ship ${ship_number} not found`);
    }
  } else if (typeof ship === "object" && ship != null) {
    ship_number = game.ships.indexOf(ship);
    if (ship_number < 0) {
      error(`Ship not found`);
      ship = null;
    } else {
      ship_number++;
    }
  } else {
    error(`Wrong "ship" argument type`);
    ship = null;
  }
  return [ship, ship_number];
};

var ship_instructor = function(ship, message, time = 15, character = "Lucina") {
  [ship] = find_ship(ship);
  if (!ship) {
    return;
  }
  clearTimeout(ship.custom.instructor_timer);
  ship.instructorSays(message, character);
  hide_race_info(ship);
  var cleaner = instructor_cleaner(message);
  ship.custom.instructor_timer = setTimeout(function() {
    if (cleaner.length > 0) {
      ship.instructorSays(cleaner, character);
    }
    ship.hideInstructor();
    show_race_info(ship);
  }, time * 1000);
};

var warnings = [
  "\nWarning! (rule 1)\nDangerous driving!\nIf you continue, you will be removed from leaderboard, then kicked\n",
  "\nWarning! (rule 2)\nTrolling detected!\nContinue - instant kick!\n\n",
];

var warn = function(ship, rule, time = 25, character = "Zoltar") {
  if (rule < 1 || rule > warnings.length) {
    error(`Unknown rule number (should be 1 to ${warnings.length})`);
    return;
  }
  rule--;
  ship_instructor(ship, warnings[rule], time, character);
};

var flags = {
  Y: {
    message: "\n\nYellow flag!\nCation: some problem detected.\nDrive carefully and with respect for others.\n",
    time: 25,
    character: "Maria",
  },
  R: {
    message: "\n\nRed flag!\nRace will be stopped either due to a critical bug or because of huge trolling! :(\nPlease wait for restart",
    time: 40,
    character: "Zoltar",
  },
  G: {
    message: "\n\n\nGreen flag!\nRace continues\n\n",
    time: 15,
    character: "Klaus",
  },
  VSC: {
    message: "\n\n\nVirtual safety car!\nAll ships are immobilized\n(for 10-30 sec)\nI need to kick a troll or there was an incident which I have to fix.",
    time: 30,
    character: "Maria",
    idle: true,
  },
};

var flag = function(flag) {
  var found = false;
  var lc_flag = String(flag).toLowerCase();
  for (var key of Object.keys(flags)) {
    if (key.toLowerCase() === lc_flag) {
      found = true;
      break;
    }
  }
  if (!found) {
    error("Unknown flag: " + flag);
    return;
  }

  var idle_ships = function() {
    for (var ship of game.ships) {
      ship.set({idle:true,vx:0,vy:0});
    }
    afk_check.disable(true);
  }
  var reset_ships = function() {
    for (var ship of game.ships) {
      ship.set({idle:false});
    }
    afk_check.enable(true);
  }

  var timeout_action = null;
  if (flags[key].idle) {
    idle_ships();
    timeout_action = reset_ships;
  } else {
    reset_ships();
  }
  instructor(flags[key].message, flags[key].time, flags[key].character, true, timeout_action);
};

var kick_position = 10 * map_size / 2;
kick_position = {x: -kick_position, y: kick_position};

var space = num => " \u2063".repeat(num);
var kick_message = {
  "": "Kick!" + space(46),
  " ":"You were kicked because violated game rules" + space(7)
};
var late_message = {
  "": "You were kicked" + space(35),
  " ":"Sorry, you are late, race is already running" + space(10)
};

var kick = function(ship, message_object) {
  [ship] = find_ship(ship);
  if (!ship) {
    return;
  }
  outlap.clear_outlap(ship);
  clearTimeout(ship.custom.instructor_timer);
  ship.custom.afk_init_step = 0;
  ship.custom.afk_seconds = 0;
  ship.custom.afk = false;
  ship.custom.troll_step = 0;
  ship.custom.troll = false;
  // TODO: fix kill - set infinite shield regen for all ships, make ships vulnerable
  // ship.set({x: kick_position.x, y: kick_position.y, kill: true});
  if (typeof message_object === "object" && message_object !== null) {
    ship.gameover(message_object);
  } else {
    ship.gameover(kick_message);
  }
};

var type = function(ship, type = null) {
  var [ship, ship_number] = find_ship(ship);
  if (!ship) {
    return;
  }

  if (type) {
    if (typeof type !== "number") {
      error(`"type" argument is not a number`);
      return;
    }
    // Shift ship.type for level 1 ships
    // (because of hidden starting ship 101)
    var type_real = type;
    if (type > 99 && type < 200) {
      if (ship_codes.includes(type + 1)) {
        type_real = type + 1;
      }
    }
    if (!all_ship_codes.includes(type_real)) {
      error(`Unknown ship type: ${type}`);
      return;
    }
    echo(`Set ship ${ship_number} type to: ${type}`);
    ship.set({type: type_real});
    ship.custom.spectator = spectator_codes.includes(type_real);
  } else {
    type = ship.type;
    // Shift ship.type for level 1 ships
    // (because of hidden starting ship 101)
    if (type > 99 && type < 200) {
      if (ship_codes.includes(type)) {
        type--;
      }
    }
    echo(`Ship ${ship_number} type: ${type}`);
  }
};

var spec = function(ship) {
  var [ship, ship_number] = find_ship(ship);
  if (!ship) {
    return;
  }
  if (ship.custom.spectator) {
    error(`Ship ${ship_number} is already a spectator`);
    return;
  }
  echo(`Make ship ${ship_number} a spectator`);
  ship.set({vx: 0, vy: 0, type: spectator_codes[0]});
  ship.custom.spectator = true;
  if (!ship.custom.allow_switch) {
    ship.custom.allow_switch = true;
    ship.setUIComponent(change_button);
  }
  var num = Math.ceil(spectators_level);
  setTimeout(function() {
    for (var i = 0; i < num; i++) {
      game.addCollectible({code: 90, x: ship.x, y: ship.y});
    }
  }, 200);
};

var unspec = function(ship) {
  var [ship, ship_number] = find_ship(ship);
  if (!ship) {
    return;
  }
  if (!ship.custom.spectator) {
    error(`Ship ${ship_number} is already not a spectator`);
    return;
  }
  echo(`Make ship ${ship_number} a regular ship`);
  // TODO: remember previous ship choice, revert it here
  ship.set({type: ship_codes[0]});
  ship.custom.spectator = false;
  if (ship.custom.allow_switch) {
    ship.custom.allow_switch = false;
    ship.setUIComponent(change_button_hidden);
  }
};

// Add global functions to terminal commands
// Allowed params: strings, numbers, null / false / true

var commands = {
  instructor,
  flag,
  warn,
  kick,
  type,
  spec,
  unspec,
};

var command_function = function(line) {
  line = line.trim();
  var match_command = line.match(/^(\S+)\s*(\S.*)?$/);
  if (!match_command) {
    error(`Can't extract command name from call string:\n"${line}"`);
    return;
  }
  var command = match_command[1];
  if (!commands[command]) {
    error(`Unknown command: "${command}"`);
    return;
  }
  if (typeof commands[command] !== "function") {
    error(`Command is not a function: "${command}"`);
    return;
  }

  line = match_command[2];
  if (!line) {
    commands[command].apply(this);
    return;
  }

  var pre_args = line.split(/(?<=[^\\]")[, ] *|[, ] *(?=")/);
  var args = [];
  for (var str of pre_args) {
    if (str.includes('"')) {
      args.push(str.replace(/"/g, ""));
    } else {
      for (var val of str.split(/[, ] */)) {
        if (val.length > 0) {
          if (val === "null") {
            val = null;
          } else if (val === "false") {
            val = false;
          } else if (val === "true") {
            val = true;
          } else {
            var num = Number(val);
            if (!isNaN(num) && !isNaN(parseFloat(val))) {
              val = num;
            }
          }
        }
        args.push(val);
      }
    }
  }
  commands[command].apply(this, args);
};

if (!public_event) {
  for (var command of Object.keys(commands)) {
    game.modding.commands[command] = command_function;
  }
}

// Servicing functions

var announce_lap_record = function(lap_time, player) {
  instructor(`\nNew lap record!\n\n${lap_time} - ${player}\n\n`, 7, "Kan");
};

var troll_warning = "\nStop trolling or messing around on lap! Either stay in spawn-zone, or drive race laps.\nNext time will be kicked!\n";

var warn_troll = function(ship, time = 25, character = "Zoltar") {
  ship_instructor(ship, troll_warning, time, character);
};

// AFK check

var afk_check = {
  state: true,
  disable: function(with_idle = false) {
    if (!this.state) {
      return;
    }
    this.state = false;
    for (var ship of game.ships) {
      ship.custom.afk_init_step = 0;
      ship.custom.afk_seconds = 0;
      ship.custom.afk = false;
    }
    var message = "AFK check disabled";
    if (with_idle) {
      message = "Ships are idle\n" + message;
    }
    color_echo(message, "Gold");
  },
  enable: function(with_idle = false) {
    if (this.state || game_type === games.testing) {
      return;
    }
    this.state = true;
    var message = "AFK check enabled";
    if (with_idle) {
      message = "Ships are no longer idle\n" + message;
    }
    color_echo(message, "Lime");
  },
  check: function(ship, index) {
    if (this.state && !ship.custom.on_spawn_zone) {
      if (Math.sqrt(Math.pow(ship.vx, 2) + Math.pow(ship.vy, 2)) < afk_speed) {
        if (!ship.custom.afk) {
          if (!ship.custom.afk_init_step) {
            ship.custom.afk_init_step = game.step;
          } else {
            ship.custom.afk_seconds = (game.step - ship.custom.afk_init_step) / 60;
            if (ship.custom.afk_seconds >= afk_timeout) {
              ship.custom.afk = true;
              color_echo_with_name("AFK:", index + 1, ship.name, "DarkOrange");
              afk_action(ship);
            }
          }
        }
      } else {
        ship.custom.afk_init_step = 0;
        ship.custom.afk_seconds = 0;
        if (ship.custom.afk) {
          ship.custom.afk = false;
          color_echo_with_name("No longer AFK:", index + 1, ship.name, "LimeGreen");
        }
      }
    }
  },
};

// Out lap detection

var outlap = {
  lap_map: null,
  spawn_zone: null,
  spawn_zone_map: null,
  lap_map_size: map_size * lap_map_precision,
  outlap_delay: outlap_delay * 1000,
  onlap_blink_time: onlap_blink_time * 60,
  pos_offset: 10 * map_size / 2,
  pos_div: 10 / lap_map_precision,
  init_lap_map: function(map) {
    var new_map = [];
    var map_lines = map.split("\n");
    if (map_lines.length !== map_size) {
      fatal_error("Mismatched map_size and number of custom_map lines");
    }
    this.lap_map = {};
    this.spawn_zone = [];
    this.spawn_zone_map = {};
    var map_y = 0;
    for (var line of map_lines) {
      if (line.length !== map_size) {
        fatal_error("Mismatched map_size and length of custom_map line " + (map_y + 1));
      }
      var spawn_zone_found = false;
      var safe_y_start = map_y * lap_map_precision;
      var safe_y_end = safe_y_start + lap_map_precision;
      var lap_y_start = safe_y_start - lap_map_overlap;
      var lap_y_end = safe_y_end + lap_map_overlap;
      var map_x = 0;
      for (var symbol of line) {
        if (symbol === "+") {
          spawn_zone_found = true;
          this.spawn_zone.push({x: map_x, y: map_y});
        } else if (!/\d/.test(symbol)) {
          var safe_x_start = map_x * lap_map_precision;
          var safe_x_end = safe_x_start + lap_map_precision;
          var lap_x_start = safe_x_start - lap_map_overlap;
          var lap_x_end = safe_x_end + lap_map_overlap;
          for (var y = safe_y_start; y < safe_y_end; y++) {
            if (!this.lap_map[y]) {
              this.lap_map[y] = {};
            }
            for (var x = safe_x_start; x < safe_x_end; x++) {
              this.lap_map[y][x] = 2; // safe zone
            }
          }
          for (var lap_y = lap_y_start; lap_y < lap_y_end; lap_y++) {
            var y = lap_y % this.lap_map_size;
            if (y < 0) {
              y += this.lap_map_size;
            }
            if (!this.lap_map[y]) {
              this.lap_map[y] = {};
            }
            for (var lap_x = lap_x_start; lap_x < lap_x_end; lap_x++) {
              var x = lap_x % this.lap_map_size;
              if (x < 0) {
                x += this.lap_map_size;
              }
              if (!this.lap_map[y][x]) {
                this.lap_map[y][x] = 1; // on lap
              }
            }
          }
        }
        map_x++;
      }
      if (spawn_zone_found) {
        line = line.replace(/\+/g, "9");
      }
      new_map.push(line);
      map_y++;
    }
    var empty_y = {};
    for (var y = 0; y < this.lap_map_size; y++) {
      if (!this.lap_map[y]) {
        this.lap_map[y] = empty_y;
      }
    }
    // TODO: add error handling for spawn_zone square
    var spawn_index = [];
    var spawn_start = this.spawn_zone[0];
    var spawn_end = this.spawn_zone[this.spawn_zone.length-1];
    spawn_start.x = (spawn_start.x + 1) * lap_map_precision - lap_map_overlap;
    spawn_start.y = (spawn_start.y + 1) * lap_map_precision - lap_map_overlap;
    spawn_end.x = spawn_end.x * lap_map_precision + lap_map_overlap;
    spawn_end.y = spawn_end.y * lap_map_precision + lap_map_overlap;
    for (var y = spawn_start.y; y < spawn_end.y; y++) {
      for (var x = spawn_start.x; x < spawn_end.x; x++) {
        var status = this.lap_map[y][x];
        if (status) {
          if (!this.spawn_zone_map[y]) {
            this.spawn_zone_map[y] = {};
          }
          this.spawn_zone_map[y][x] = true;
          if (status === 2) {
            spawn_index.push({x, y});
          }
        }
      }
    }
    for (var y = 0; y < this.lap_map_size; y++) {
      if (!this.spawn_zone_map[y]) {
        this.spawn_zone_map[y] = empty_y;
      }
    }
    this.spawn_zone = spawn_index;
    map = new_map.join("\n");
    return map;
  },
  lap_map_pos: function(ship) {
    var x = Math.trunc((this.pos_offset + ship.x) / this.pos_div) % this.lap_map_size;
    var y = Math.trunc((this.pos_offset - ship.y) / this.pos_div) % this.lap_map_size;
    if (x < 0) {
      x += this.lap_map_size;
    }
    if (y < 0) {
      y += this.lap_map_size;
    }
    return {x, y};
  },
  game_pos: function(position) {
    var x = (position.x + 0.5) * this.pos_div - this.pos_offset;
    var y = this.pos_offset - (position.y + 0.5) * this.pos_div;
    return {x, y};
  },
  bind_outlap: function(outlap, ship) {
    return function() {
      ship.custom.outlap_timer = 0;
      var position = outlap.lap_map_pos(ship);
      if (!outlap.lap_map[position.y][position.x]) {
        ship.set({
          x: ship.custom.safe_x,
          y: ship.custom.safe_y,
          vx: 0,
          vy: 0,
          invulnerable: outlap.onlap_blink_time,
          healing: false,
        });
      }
    }
  },
  clear_outlap: function(ship) {
    if (ship.custom.outlap_timer) {
      clearTimeout(ship.custom.outlap_timer);
      ship.custom.outlap_timer = 0;
      ship.set({healing: false});
    } else if (ship.healing) {
      ship.set({healing: false});
    }
  },
  check: function(ship) {
    var position = this.lap_map_pos(ship);
    var status = this.lap_map[position.y][position.x];
    // safe zone
    if (status === 2) {
      ship.custom.safe_x = ship.x;
      ship.custom.safe_y = ship.y;
      ship.custom.safe_lap_map_pos = position;
      this.clear_outlap(ship);
      this.check_spawn_zone(ship, position);
    // on lap
    } else if (status) {
      this.clear_outlap(ship);
      this.check_spawn_zone(ship, position);
    // out lap
    } else if (!ship.custom.outlap_timer && !ship.healing) {
      ship.custom.outlap_timer = setTimeout(this.bind_outlap(this, ship), this.outlap_delay);
      ship.set({vx: 0, vy: 0, healing: true});
      if (ship.custom.allow_switch) {
        ship.custom.allow_switch = false;
        ship.setUIComponent(change_button_hidden);
      }
    }
  },
  check_spawn_zone: function(ship, position) {
    var status = this.spawn_zone_map[position.y][position.x];
    ship.custom.on_spawn_zone = status;

    // ship is in spawn-zone
    if (status) {
      // TODO: replace with "afk_check.reset(ship)" / "troll_check.reset(ship)"
      ship.custom.afk_init_step = 0;
      ship.custom.afk_seconds = 0;
      ship.custom.afk = false;
      ship.custom.troll_step = 0;
      ship.custom.troll = false;
    }

    if (allow_ship_switch && status) {
      if (!ship.custom.allow_switch) {
        ship.custom.allow_switch = true;
        ship.setUIComponent(change_button);
      }
    } else if (ship.custom.allow_switch) {
      ship.custom.allow_switch = false;
      ship.setUIComponent(change_button_hidden);
    }
  },
}

var checkShip = function(ship, index) {
  if (!ship.alive) {
    return;
  }

  if (!ship.custom.init) {
    ship.custom.init = true;
    // reset starting ship from hidden to visible in tree
    if (ship.type === 101) {
      ship.set({type: starting_ship_switch, stats: 0});
    }
    // TODO: add spectator joining
    // (set ship to spectator for allowed players at game join, when needed)
    if (ship.custom.spectator) {
      spawn_ship(ship);
    } else {
      if (game.custom.closed) {
        spawn_ship(ship, true);
        if (rotate_tracks) {
          setTimeout(function() {
            ship_instructor(ship, "\n\nRace is already running,\nplease wait for next race\n\n", 20, "Maria");
          }, 1000 * 10);
        } else {
          kick(ship, late_message);
        }
      } else {
        if (game.custom.status == "race_start") {
          put_ship_on_grid(ship, index, true);
          if (pinned_ship) {
            ship.set({type: pinned_ship});
          }
        } else if (game.custom.status == "race") {
          // TODO ?
          // remake to new order of newly added ships during race only,
          // consider if other players still not left starting grid
          put_ship_on_grid(ship, index);
          if (pinned_ship) {
            ship.set({type: pinned_ship});
          }
        } else {
          spawn_ship(ship);
        }
      }
      ship_instructor(ship, welcome_message[game_type], 20, "Lucina");
    }
  } else if (!ship.custom.spectator) {
    afk_check.check(ship, index);
    outlap.check(ship);
  }

  if (ship.custom.current_checkpoint == null)
  {
    ship.custom.current_checkpoint = 0;
    ship.custom.checkpoint_count = 0;
    ship.custom.lap_count = 0;
    ship.custom.checkpoint_time = 0;
    ship.custom.best_lap = 100000;
    if (ship.game.custom.status == "qualification") {
      race_info.components[0].value = "Qualification";
      race_info.visible = true;
      update_race_info();
    }
  }

  if (checkCheckPoint(ship,checkpoints[ship.custom.current_checkpoint]))
  {
    if (ship.game.custom.status != "qualification" && ship.custom.lap_count>race_laps)
    {
    }
    else
    {
      if (checkpoint_times[ship.custom.checkpoint_count] == null)
      {
        checkpoint_times[ship.custom.checkpoint_count] = ship.game.step/60;
        ship.custom.checkpoint_delta = 0;
      }
      else
      {
        ship.custom.checkpoint_delta = Math.round(ship.game.step/60-checkpoint_times[ship.custom.checkpoint_count]);
      }
      ship.custom.checkpoint_count++;
      ship.custom.checkpoint_time = ship.game.step/60/3600;
    }
    if (ship.custom.current_checkpoint == 0)
    {
      ship.custom.lap_count++;
      if (!game.custom.enable_drs && ship.custom.lap_count == enable_drs_on_race_lap) {
        game.custom.enable_drs = true;
        game.custom.drs_step = game.step % drs_step;
      }
      if (ship.custom.lap_start != null)
      {
        var time = (game.step-ship.custom.lap_start-1+extra_bit)/60;
        if (ship.custom.best_lap == null || time<ship.custom.best_lap)
        {
          ship.custom.best_lap = time;
          if (ship.custom.lap_count <= race_laps)
          {
            var time_formatted = formatLapTime(time);
            lap_info.components[0].value = "Best lap! "+ time_formatted;
            ship.setUIComponent(lap_info);
            if (game.custom.lap_record == null || game.custom.lap_record > time) {
              game.custom.lap_record = time;
              announce_lap_record(time_formatted, ship.name);
            }
          }
        }
        else
        {
          if (ship.custom.lap_count <= race_laps)
          {
            lap_info.components[0].value = "Lap time: "+ formatLapTime(time);
            ship.setUIComponent(lap_info);
          }
        }
      }
      ship.custom.lap_start = game.step-1+extra_bit;
    }
    ship.custom.current_checkpoint = (ship.custom.current_checkpoint+1)%checkpoints.length;
    if (
      ship.custom.checkpoint_count === 2
      && race_info.components[0].value.length > 0
      && game.custom.status === "qualification"
    ) {
      race_info.components[0].value = "";
      race_info.visible = true;
      update_race_info();
    }
    ship.custom.troll_step = 0;
    if (ship.custom.troll) {
      ship.custom.troll = false;
      color_echo_with_name("No longer troll:", index + 1, ship.name, "LimeGreen");
    }
  } else {
    if (!ship.custom.afk && game_type !== games.testing) {
      if (!ship.custom.troll && !ship.custom.on_spawn_zone) {
        if (!ship.custom.troll_step) {
          ship.custom.troll_step = troll_timeout * 60 + game.step;
        } else if (game.step >= ship.custom.troll_step) {
          ship.custom.troll = true;
          color_echo_with_name("Troll:", index + 1, ship.name, "Tomato");
          if (!ship.custom.troll_warning) {
            ship.custom.troll_warning = true;
            warn_troll(ship);
            respawn_ship(ship);
          } else {
            kick(ship);
          }
        }
      }
    } else {
      ship.custom.troll_step = 0;
      if (ship.custom.troll) {
        ship.custom.troll = false;
        // color_echo_with_name("Troll is gonna AFK:", index + 1, ship.name, "Orange");
      }
    }
  }

  if (ship.custom.lap_start != null)
  {
    var seconds = Math.floor((ship.game.step-ship.custom.lap_start-1+extra_bit)/60);
    if ((seconds>=5 || ship.custom.best_lap>10000) && seconds != ship.custom.seconds && ship.game.custom.status != "race_end")
    {
      ship.custom.seconds = seconds;
      var minutes = Math.floor(seconds/60);
      seconds = seconds%60;
      if (seconds<10) seconds = "0"+seconds;
      lap_info.components[0].value = minutes+":"+seconds;
      ship.setUIComponent(lap_info);
    }
  }
  else if (ship.game.custom.status == "qualification")
  {
    if (ship.custom.seconds != "Race for fastest lap")
    {
      ship.custom.seconds = "Race for fastest lap";
      lap_info.components[0].value = "Race for fastest lap";
      ship.setUIComponent(lap_info);
    }
  }
};

var createCheckPoint = function() {
  var x = game.ships[0].x;
  var y = game.ships[0].y;
  var direction = game.ships[0].r;
  // echo("{x:"+x+",y:"+y+",direction:"+direction+"}");
};

var extra_bit = 0;
var checkpoint_times = [];

var checkCheckPoint = function(ship,checkpoint) {
  if (ship.custom.spectator) {
    return false;
  }
  var vx = Math.cos(checkpoint.direction);
  var vy = Math.sin(checkpoint.direction);
  var dx = ship.x-checkpoint.x;
  var dy = ship.y-checkpoint.y;
  var d = Math.sqrt(dx*dx+dy*dy);
  //echo(ship.y);
  var passed = false;
  if (d<checkpoint.width)
  {
    var projection = vx*dx+vy*dy;
    //echo(projection);
    if (ship.custom.projection != null)
    {
      if (ship.custom.projection<0 && projection>=0)
      {
        passed = true;
        extra_bit = (0-ship.custom.projection)/(projection-ship.custom.projection);
      }
    }
    ship.custom.projection = projection;
  }
  return passed;
};

var updateScoreboard = function(game) {
  scoreboard.components = [];
  var line = 0;
  if (game.custom.status == "qualification")
  {
    scoreboard.components.push({ type: "text",position: [0,line*10+1,100,8],color: "#FFF",value: "Qualification "+formatMinutesSeconds(game.custom.qualification_time)});
    line++;
  }
  else
  {
    scoreboard.components.push({ type: "text",position: [0,line*10+1,100,8],color: "#FFF",value: "Race" });
    line++;
  }
  for (var i=0;i<game.ships.length;i++)
  {
    var ship = game.ships[i];
    if (ship.custom.best_lap == null)
    {
      ship.custom.best_lap = 1000000;
    }
  }

  if (game.custom.status == "qualification")
  {
    game.ships.sort(function(a,b) { return a.custom.best_lap-b.custom.best_lap});
  }
  else
  {
    game.ships.sort(function(a,b) {
      return (b.custom.checkpoint_count*1000-b.custom.checkpoint_time)-(a.custom.checkpoint_count*1000-a.custom.checkpoint_time);
    });
  }

  var score = 10;
  var delta = 0;

  for (var i=0;i<game.ships.length;i++)
  {
    var ship = game.ships[i];
    if (ship.score != score)
    {
      ship.set({score:score});
    }
    score = Math.max(0,score-1);
  }

  for (var i=0;i<game.ships.length;i++)
  {
    if (line>=10)
    {
      break;
    }
    var ship = game.ships[i];
    if (game.custom.status != "qualification")
    {
      if (game.custom.status != "race_end" || ship.custom.lap_count>race_laps)
      {
        scoreboard.components.push({ type: "text", position: [0,line*10+1,14,8],color: "#FFF",align:"right",value:line+"."});
      }
      scoreboard.components.push({ type: "player",id: ship.id, position: [15,line*10+1.5,85,7],color: "#FFF",align:"left"});
      if (ship.custom.checkpoint_delta != null && ship.custom.checkpoint_delta>delta)
      {
        delta = ship.custom.checkpoint_delta;
        scoreboard.components.push({ type: "text",position: [80,line*10+1,18,8],color: "#FFF",value: "+"+delta+"''",align:"right"});
      }
    }
    else
    {
      scoreboard.components.push({ type: "player",id: ship.id, position: [0,line*10+1.5,60,7],color: "#FFF",align:"left"});
      if (ship.custom.best_lap != null)
      {
        scoreboard.components.push({ type: "text",position: [60,line*10+1,38,8],color: "#FFF",value: formatLapTime(ship.custom.best_lap),align:"right"});
      }
    }
    line += 1;
  }
};

var game_reset = function(second) {
  setTrack(game, current_track);
  game.custom.status = "qualification";
  game.custom.closed = false;
  game.custom.status_time = second + qualification_duration;
  game.custom.qualification_time = qualification_duration;
  game.custom.lap_record = null;
  game.custom.enable_drs = true;
  game.custom.drs_step = game.step % drs_step;
};

// game steps:
var manageGame = function(game,second) {
  if (game.custom.status == null)
  {
    game_reset(second);
  }
  switch (game.custom.status)
  {
    case "qualification":
      var t = Math.max(0,game.custom.status_time-second);
      game.custom.qualification_time = t;
      if (t == 0) {
        game.custom.status = "race_start";
        game.custom.status_time = second+race_start_delay;
        race_info.components[0].value = "Prepare for race!";
        // game.setOpen(false);
        update_race_info(null, true);
        createStartingGrid(game);
        if (show_championship_table) {
          resetTrackResult(current_track);
          var ship = game.ships[0];
          if (ship != null && ship.custom.best_lap < 10000) {
            setQualificationBonus(current_track,ship.id,ship.name,2);
          }
        }
      }
      break;

    case "race_start":
      t = Math.max(0, game.custom.status_time - second);
      if (t <= race_start_countdown) {
        countdown.visible = true;
        game.setUIComponent(countdown);
      }
      if (t == 0) {
        startRace(game);
        game.custom.status = "race";
      } else {
        var num = countdown.components.length;
        if (t <= num) {
          countdown.components[num - t].fill = "#171717"
        }
      }
      break;

    case "race":
      if (!game.custom.closed) {
        if (game.step > game.custom.close_step) {
          game.custom.closed = true;
        }
      }
      if (countdown.visible)
      {
        countdown.visible = false;
        game.setUIComponent(countdown);
      }
      for (var i=0;i<game.ships.length;i++)
      {
        var ship = game.ships[i];
        if (ship.custom.lap_count>race_laps)
        {
          game.custom.status = "race_end";
          game.custom.status_time = second+time_after_race;
          lap_info.components[0].value = "Checkered flag!";
          lap_info.visible = true;
          ship.game.setUIComponent(lap_info);
        }
        else
        {
          var pos = (i+1);
          if (i<positions.length)
          {
            pos = positions[i];
          }
          var text = pos+" - Lap "+ship.custom.lap_count+"/"+race_laps;
          if (ship.custom.race_info != text)
          {
            ship.custom.race_info = text;
            race_info.components[0].value = text;
            race_info.visible = true;
            update_race_info(ship);
          }
        }
      }
      break;

    case "race_end":
      t = Math.max(0,game.custom.status_time-second);
      for (var i=0;i<game.ships.length;i++)
      {
        var ship = game.ships[i];
        var text;
        if (ship.custom.lap_count>race_laps)
        {
          if (i==0)
          {
            text = "P1, P1! Good job, perfect race!";
          }
          else
          {
            if (i<positions.length)
            {
              text = positions[i]+ " Place! Podium, almost win. Next time, try to take 1st position:)";
            }
            else
            {
              text = "P"+(i+1)+"!"+" Good driving, dude";
            }
          }
          if (!ship.custom.race_end) {
            ship.custom.race_end = true;
            spawn_ship(ship, true);
            var points = championship_points[i] || 0;
            if (show_championship_table) {
              setRacePoints(current_track,ship.id,ship.name,points);
            }
          }
        }
        else
        {
          var pos = (i+1);
          if (i<positions.length)
          {
            pos = positions[i];
          }
          text = pos+" - Lap "+ship.custom.lap_count+"/"+race_laps;
        }
        if (ship.custom.race_info != text)
        {
          ship.custom.race_info = text;
          if (t>30)
          {
            race_info.components[0].value = text;
            race_info.visible = true;
            update_race_info(ship);
          }
          lap_info.components[0].value = text;
          lap_info.visible = true;
          ship.setUIComponent(lap_info);
        }
      }

      if (t == end_message_time) {
        race_info.components[0].value = "Checkered flag, Race End!";
        race_info.visible = true;
        update_race_info(null, true);
        if (show_championship_table) {
          hide_spawn_objects(game);
          // DEBUG:
          // echo(JSON.stringify(global_results));
          // echo(JSON.stringify(createResultTable()));
          displayChampionshipTable(createResultTable());
        }
      } else if (t == 3 && rotate_tracks) {
        race_info.components[0].value = "Next Race!";
        race_info.visible = true;
        update_race_info();
      } else if (t == 0) {
        if (show_championship_table) {
          hideChampionshipTable();
        }
        if (rotate_tracks) {
          game.custom.status = "qualification";
          game.custom.closed = false;
          game.custom.status_time = second+qualification_duration;
          game.custom.lap_record = null;
          game.custom.enable_drs = true;
          game.custom.drs_step = game.step % drs_step;
          // game.setOpen(true);
          current_track = (current_track+1)%tracks.length;
          setTrack(game,current_track);
        }

        for (var i = 0; i < game.ships.length; i++) {
          var ship = game.ships[i];
          var rank = i < positions.length ? positions[i] : ((i+1)+"th");
          var lap = formatLapTime(ship.custom.best_lap);
          reset_ship(ship);
          if (rotate_tracks) {
            if (ship.alive) {
              spawn_ship(ship);
            }
            ship.intermission({
              "Your rank": rank,
              "Your best lap": lap
            });
          } else {
            ship.gameover({
              "Your rank": rank,
              "Your best lap": lap
            });
          }
        }
      }
      break;
  }
};

var changeShip = function(ship) {
  if (ship.custom.allow_switch && !(ship.custom.next_switch_step > game.step)) {
    ship.custom.next_switch_step = game.step + ship_switch_delay;
    var next_type = ship_switch[ship.type];
    if (next_type) {
      ship.set({type: next_type});
    }
  }
};


//!
var spawn_ship = function(ship, idle) {
  if (ship.custom.on_spawn_zone) {
    if (pinned_ship) {
      ship.set({vx: 0, vy: 0, idle: !!idle, generator: 300, type: pinned_ship});
    } else {
      ship.set({vx: 0, vy: 0, idle: !!idle, generator: 300});
    }
  } else {
    // get random position on spawn-zone
    do {
      var spawn_pos = outlap.spawn_zone[Math.floor(Math.random() * outlap.spawn_zone.length)];
      // skip positions taken by other ships
      for (var test_ship of game.ships) {
        if (
          test_ship !== ship
          && test_ship.custom.on_spawn_zone
          && Math.abs(test_ship.custom.safe_lap_map_pos.x - spawn_pos.x) < lap_map_precision
          && Math.abs(test_ship.custom.safe_lap_map_pos.y - spawn_pos.y) < lap_map_precision
        ) {
          spawn_pos = null;
          break;
        }
      }
    } while (spawn_pos == null);
    var pos = outlap.game_pos(spawn_pos);
    if (pinned_ship) {
      ship.set({x: pos.x, y: pos.y, vx: 0, vy: 0, idle: !!idle, generator: 300, type: pinned_ship});
    } else {
      ship.set({x: pos.x, y: pos.y, vx: 0, vy: 0, idle: !!idle, generator: 300});
    }
    ship.custom.on_spawn_zone = true;
  }
  // TODO: implement proper fix for idle here
  if (idle) {
    setTimeout(function() {
      ship.set({vx: 0, vy: 0});
    }, 1000 * 2);
  }
};

var respawn_ship = function(ship) {
  spawn_ship(ship);
  if (ship.custom.lap_start != null) {
    ship.custom.lap_start = null;
    if (ship.custom.lap_count > 0) {
      ship.custom.lap_count--;
    }
    ship.custom.checkpoint_count -= ship.custom.current_checkpoint || checkpoints.length;
    if (ship.custom.checkpoint_count < 0) {
      ship.custom.checkpoint_count = 0;
    }
  }
  ship.custom.current_checkpoint = 0;
  ship.custom.checkpoint_delta = 0;
};

var reset_ship = function(ship) {
  ship.custom.current_checkpoint = null;
  ship.custom.checkpoint_count = 0;
  ship.custom.checkpoint_time = 0;
  ship.custom.checkpoint_delta = 0;
  ship.custom.best_lap = 100000;
  ship.custom.lap_start = null;
  ship.custom.lap_count = 0;
  ship.custom.race_end = false;

  outlap.clear_outlap(ship);
  clearTimeout(ship.custom.instructor_timer);
  ship.custom.afk_init_step = 0;
  ship.custom.afk_seconds = 0;
  ship.custom.afk = false;
  ship.custom.troll_step = 0;
  ship.custom.troll = false;

  race_info.components[0].value = "";
  race_info.visible = true;
  update_race_info();
};

var put_ship_on_grid = function(ship, index, idle) {
  ship.custom.current_checkpoint = 0;
  ship.custom.lap_count = 0;
  ship.custom.checkpoint_count = 0;
  ship.custom.checkpoint_time = 0;
  ship.custom.lap_start = null;
  ship.custom.checkpoint_delta = 0;
  ship.emptyWeapons();
  index = index % 2;
  ship.set({
    x: starting_grid.x[index],
    y: starting_grid.y[index],
    vx: 0,
    vy: 0,
    idle: !!idle,
    angle: starting_grid.angle,
    generator: 200
  });
  starting_grid.next_position();
};

var createStartingGrid = function(game) {
  afk_check.disable(true);
  game.custom.lap_record = null;
  game.custom.enable_drs = false;
  allow_ship_switch = false;
  hide_spawn_switch(game);
  var index = 0;
  for (var ship of game.ships) {
    if (!ship.custom.spectator) {
      put_ship_on_grid(ship, index, true);
      index++;
    }
  }
};

var startRace = function(game) {
  for (var i=0;i<game.ships.length;i++)
  {
    var ship = game.ships[i];
    ship.set({idle:false});
    ship.custom.current_checkpoint = 0;
    ship.custom.lap_count = 0;
    ship.custom.checkpoint_count = 0;
    ship.custom.checkpoint_time = 0;
    ship.custom.lap_start = null;
    ship.custom.checkpoint_delta = 0;
    ship.custom.best_lap = 100000;
  }
  checkpoint_times = [];
  afk_check.enable(true);
  game.custom.close_step = game.step + race_close_time - 1;
};


// Reset game if mod was edited while running
if (game && game.step > 0) {
  game_reset(Math.trunc(game.step / 60));
  if (game_type !== games.testing) {
    for (var ship of game.ships) {
      reset_ship(ship);
      if (ship.alive) {
        spawn_ship(ship);
      }
    }
  }
}

if (game_type === games.testing) {
  color_echo(welcome_message[game_type], "Tomato", "b");
  afk_check.disable();
}


// Prepare ships

var array_specs;
var sort_specs = function(specs, ship_key) {
  // array specs - "spec":[min, max]
  array_specs = {
    dash_speed:        specs.ship.dash.speed,
    dash_acceleration: specs.ship.dash.acceleration,
  };
  // check specs
  for (var [param, spec] of Object.entries(array_specs)) {
    if (!Array.isArray(spec)) {
      fatal_error(
        `Can't find array spec in ship "${ship_key}" for param "${param}"\n` +
        `Check ship code and "sort_specs" function`
      );
    }
  }
};

var unknown_params = {};
var set_params = function (params) {
  if (params) {
    for (var [param, value] of Object.entries(params)) {
      if (value) {
        var spec = array_specs[param];
        if (spec) {
          spec[0] = spec[1] = value;
        } else if (!unknown_params[param]) {
          unknown_params[param] = true;
          error(`Unknown ship param "${param}"`);
        }
      }
    }
  }
};

var game_ships = [];
var levels = {};

var parse_ship = function(key, ship) {
  try {
    return JSON.parse(ship);
  } catch (e) {
    fatal_error(`Can't parse JSON code of ship "${key}"`);
  }
};

var prepare_ships = function(level, ships, params) {
  var ship_entries = Object.entries(ships);
  for (var entry of ship_entries) {
    var [key, ship] = entry;
    if (typeof ship === "string") {
      ship = parse_ship(key, ship);
    }
    // fix typespec if necessary
    // also required for set params below
    ship.typespec.specs = ship.specs;

    var ship_params = params && params[key];
    if (ship_params) {
      sort_specs(ship.specs, key);
      set_params(ship_params);
    }
    ship.typespec.level = ship.level = level;
    entry[1] = ship;
  }
  // sort entries by initial ship model
  ship_entries.sort((a, b) => a[1].model - b[1].model);
  return ship_entries;
};

var push_ships = function(ships_meta) {
  for (var {ship, model, code, next} of ships_meta) {
    ship.typespec.model = ship.model = model;
    ship.typespec.code = code;
    if (next) {
      next = [next, next];
    } else {
      next = [];
    }
    ship.typespec.next = ship.next = next;
    ship = JSON.stringify(ship);
    game_ships.push({ ship, code });
  }
};

var add_ships = function(level, ships, params = null, model_shift = 0, repeat = 1) {
  var ships_meta = [];
  var ship_codes = [];
  var ship_switch = {};
  var ship_entries = prepare_ships(level, ships, params);
  var len = ship_entries.length;
  // set "next" only for ships with integer level
  var set_next = Number.isInteger(level);
  var model_step = model_shift;
  for (var i = 0; i < repeat; i++) {
    for (var [key, ship] of ship_entries) {
      var model = ship.model + model_step;
      var code = level * 100 + model;
      ship_codes.push(code);
      // set sequential switch order,
      // set sequential "next" for all ships except the last
      // (by using saved meta of previous ship)
      if (meta) {
        ship_switch[meta.code] = code;
        if (set_next) {
          meta.next = code;
        }
      }
      var meta = { key, ship, level, model, code, next: null };
      ships_meta.push(meta);
    }
    model_step = model;
  }
  ship_switch[code] = ship_codes[0]; // loop switch
  push_ships(ships_meta);
  levels[level] = (levels[level] || 0) + len * repeat;
  return [ship_switch, ship_codes, ships_meta];
};

var add_ship = function(level, model, ship_wrapped, params = null, model_shift = 0, repeat = 1) {
  var [key, ship] = Object.entries(ship_wrapped)[0];
  ship = parse_ship(key, ship);
  ship.model = model;
  ship_wrapped = { [key]: ship };
  var [,,ships_meta] = add_ships(level, ship_wrapped, params, model_shift, repeat);
  return ships_meta[0];
};

var get_first_code = function(ships_meta, search_key) {
  var meta = ships_meta.find(({key, code}) => key == search_key);
  return meta && meta.code;
};

// shift level 1 models (because of hidden starting ship 101)
var model_shift = (ships_level === 1) ? 1 : 0;

var [ship_switch, ship_codes, ships_meta] = add_ships(ships_level, ships, ship_params[vehicle_type], model_shift);
var [spectator_switch, spectator_codes] = add_ships(spectators_level, spectators);

// Combine switches
Object.assign(ship_switch, spectator_switch);

// Hidden starting ship 101
var {key} = add_ship(1.001, 0.9, starting_ship, ship_params[vehicle_type]);
var starting_ship_switch = get_first_code(ships_meta, key) || ship_codes[0];

// Starblast limitation:
// If we have level 2 ships - we must put level 1 ships as well
if (levels[2] && !levels[1]) {
  // put the same number of dummy ships - for visuality
  add_ships(1, dummy_ship, null, 1, levels[2]);
}

var all_ship_codes = [];

// Sort ships by code
game_ships = game_ships.sort((a, b) => a.code - b.code).map(val => {
  all_ship_codes.push(val.code);
  return val.ship;
});

// DEBUG:
// console.log("game_ships:");
// console.log(game_ships);
// console.log("ship_switch:");
// console.log(ship_switch);
// console.log("ship_codes:");
// console.log(ship_codes);
// console.log("ships_meta:");
// console.log(ships_meta);
// console.log("starting_ship_switch:");
// console.log(starting_ship_switch);
// fatal_error("DEBUG STOP");


this.options = {
  map_name: map_name,
  map_size: map_size,
  weapons_store: false,
  radar_zoom: 1,
  crystal_value: 0,
  ships: game_ships,
  choose_ship: ship_codes,
  reset_tree: true,
  asteroids_strength: 1e10,
  starting_ship: 800,
  healing_enabled: true,
  auto_refill: false,
  projectile_speed: 3,
  speed_mod: 1,
  starting_ship_maxed: true,
  power_regen_factor: 0,
  custom_map: "",
  invulnerable_ships: true,
  max_players: max_players,
  mines_destroy_delay: 60*50,
  soundtrack: "crystals.mp3",
  vocabulary: vocabulary,
};


this.tick = function(game) {
  for (var i=0;i<game.ships.length;i++)
  {
    var ship = game.ships[i];
    checkShip(ship, i);
  }
  if (game.step%60 == 0)
  {
    manageGame(game,game.step/60);
    updateScoreboard(game);

   for (var i=0;i<game.ships.length;i++)
    {
      var ship = game.ships[i];
      ship.setUIComponent(scoreboard);
    }
  }

  // DRS
  if (game.custom.enable_drs) {
    if (game.step % drs_step == game.custom.drs_step) {
      //DRSZONE 1
      game.addCollectible({code:90,x:30,y:0});
      game.addCollectible({code:90,x:50,y:0});
      game.addCollectible({code:90,x:70,y:0});
      game.addCollectible({code:90,x:90,y:0});
      game.addCollectible({code:90,x:110,y:0});
      //DRSZONE 2
      game.addCollectible({code:90,x:205,y:185});
      game.addCollectible({code:90,x:235,y:185});
      game.addCollectible({code:90,x:265,y:185});
      game.addCollectible({code:90,x:295,y:185});
      game.addCollectible({code:90,x:325,y:185});
    }
  }
};

this.event = function(event,game) {
  switch (event.name) {
    case "ui_component_clicked":
      var ship = event.ship;
      var component = event.id;
      if (component == "change" && ship != null) {
        changeShip(ship);
      }
      break;
  }
};


// ADDTHIS all below is the required functions for circular championship
var global_results = [];

if (show_championship_table) {
  for (var i=0;i<tracks.length;i++) {
    global_results[i] = {};
  }
}

var setPlayerResult = function(track,id,name,type,value) {
  var key = id+name;
  var res = global_results[track][key];
  if (res == null) {
    res = global_results[track][key] = {
      id: id,
      name: name,
    };
  }
  res[type] = value;
};

var setQualificationBonus = function(track,id,name,bonus) {
  setPlayerResult(track,id,name,"bonus",bonus);
};

var setRacePoints = function(track,id,name,points) {
  setPlayerResult(track,id,name,"points",points);
};

var resetTrackResult = function(track) {
  global_results[track] = {};
};

var createResultTable = function() {
  var players = {};
  var table = [];
  var online_ships = [];
  for (var ship of game.ships) {
    online_ships.push(ship.id);
  }
  for (var i=0;i<tracks.length;i++)
  {
    var keys = Object.keys(global_results[i]);
    for (var k=0;k<keys.length;k++)
    {
      var key = keys[k];
      var res = global_results[i][key];
      if (!online_ships.includes(res.id)) {
        continue;
      }

      if (players[key] == null)
      {
        players[key] = {
          name: res.name,
          id: res.id,
          points: [],
          bonus: [],
          total: 0
        }
        table.push(players[key]);
      }

      players[key].points[i] = res.points;
      players[key].bonus[i] = res.bonus;
      players[key].total += (res.points || 0) + (res.bonus || 0);
    }
  }


  table.sort(function(a,b) { return b.total-a.total ; });
  return table;
};

var championshipTable = {
  id:"championship_table",
  visible: true,
  position: [20,20,60,60],
  components: []
};

var displayChampionshipTable = function(table) {
  championshipTable.components = [];
  championshipTable.visible = true;
  var line = 0;
  var line_h = 100/17;

  championshipTable.components.push({ type: "text",position: [0,line_h*0.1,100,line_h*1.5],color: "#FFF",value: "CHAMPIONSHIP STANDINGS"});

  line = 2;
  championshipTable.components.push({ type: "box",position: [0,line_h*(line+0.1),100,line_h*0.9],fill:"hsla(200,50%,40%,0.8)"});

  championshipTable.components.push({ type: "text",position: [1,line_h*(line+0.1),38,line_h*0.9],align:"left",fill:"rgba(255,255,255,0.2)",color: "#FFF",value: "PILOT"});
  championshipTable.components.push({ type: "text",position: [40,line_h*(line+0.1),9,line_h*0.9],fill:"rgba(255,255,255,0.2)",color: "#FFF",value: "RACE"});

  var race_w = 40/tracks.length;
  for (var i=0;i<tracks.length;i++)
  {
    var x = 50+i*race_w;
    championshipTable.components.push({ type: "text",position: [x,line_h*(line+0.1),race_w-1,line_h*0.9],fill:"rgba(255,255,255,0.2)",color: "#FFF",value: (i+1)});
  }
  championshipTable.components.push({ type: "text",position: [90,line_h*(line+0.1),10,line_h*0.9],fill:"rgba(255,255,255,0.2)",color: "#FFF",value: "POINTS"});

  for (var p=0;p<Math.min(14,table.length);p++)
  {
    line += 1;
    var player = table[p];
    championshipTable.components.push({ type: "box",position: [0,line_h*(line+0.1),100,line_h*0.9],fill:"hsla(200,50%,20%,0.8)"});
    championshipTable.components.push({ type: "player",id: player.id, position: [1,line_h*(line+0.1),38,line_h*0.9],align:"left",fill:"rgba(255,255,255,0.2)",color: "#FFF",value:player.name});
    for (var i=0;i<tracks.length;i++)
    {
      var x = 50+i*race_w;
      var value = player.bonus[i]>0 ? (player.points[i]||0)+"+"+player.bonus[i] : player.points[i];
      if (value != null) {
        championshipTable.components.push({ type: "text",position: [x,line_h*(line+0.1),race_w-1,line_h*0.9],fill:"rgba(255,255,255,0.2)",color: "#FFF",value: value });
      }
    }
    championshipTable.components.push({ type: "text",position: [90,line_h*(line+0.1),10,line_h*0.9],fill:"rgba(255,255,255,0.2)",color: "#FFF",value: player.total });
  }

  var x = 50+current_track*race_w;
  championshipTable.components.push({ type: "box",position: [x,line_h*2,race_w,line_h*(line-1)],fill:"hsla(200,50%,100%,0.2)"});

  for (var i=0;i<game.ships.length;i++)
  {
    var ship = game.ships[i];
    ship.setUIComponent(championshipTable);
  }
};

var hideChampionshipTable = function(table) {
  championshipTable.components = [];
  championshipTable.visible = false;


    for (var i=0;i<game.ships.length;i++)
    {
      var ship = game.ships[i];
      ship.setUIComponent(championshipTable);
    }
};
