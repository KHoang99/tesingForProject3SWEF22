/**
 * @name DynoPlugin.plugin.js
 * @author JKot2020
 * @description This program initiates a popup survey whenever a Steam game is closed.
 *              The user rates their game experience by inputting any number 1 - 5.
 *              The data is recorded into a separate data structure.
 *              The current program relies on BetterDiscord's API and the associated libraries.
 *              Check the README for more info.
 * @version 0.0.2
 */

// Import Discord's API
 const { GuildExplicitContentFilter } = require("discord.js")

 module.exports = class RateMySession {
    constructor(meta) { }

    // TODO
    // Verify that the user is connected to Steam
    // Verification covered by other requirements

    load() { }
    start() {

      // Holds integer of game session rating
      var userRating
      // Holds string of game title
      var userGame

      // Accepts user input for survey
      function UserSurvey(props) {
        return <input
                    type="text"
                    placeholder={props.placeholder || "Type a number 1 - 5!"}
                    onChange={props?.onChange}
                />
      }

      // Verify that user input is acceptable data
      function VerifyInput(props) {
        var isValid = false
        // Input must be a valid number 1 - 5
        if (props != '1' || '2' || '3' || '4' || '5') {
          BdApi.alert("Invalid input")
          // Testing purposes
          console.log("User submitted invalid input: ", props)
          return false
        }
        // Confirm to user that input was received
        BdApi.showToast("Thank you for your input!")
        // Get integer value out of input
        ConvertInput(props)
        isValid = true
        return true
      }

      // Convert user input into an integer variable
      function ConvertInput(userRating) {
        switch(userRating) {
          case '1':
            return 1;
            break;
          case '2':
            return 2;
            break;
          case '3':
            return 3;
            break;
          case '4':
            return 4;
            break;
          case '5':
            return 5;
            break;
          default:
            return 0;
        }
      }
    
      // TODO
      // Track and confirm what Steam game was closed

      // Creates popup for survey
      BdApi.showConfirmationModal(
        "Would you like to rate your previous game session?",
        <UserSurvey
            placeholder="Type a number 1 - 5!"
            onChange={event => console.log(event)}
        />,
        {
            confirmText: "Confirm",
            cancelText: "No thanks",
            // Tests to check inputs
            onConfirm: () => (VerifyInput(props), console.log("User took the survey")),
            onCancel: () => console.log("User did not take the survey")
        }
      );

    }
    stop() {

       // TODO
       // Move userRating into data structure
       // Need to wait on partner's work for data structure

    }
    // TEST CASES
    test("Return var props to be ''", () => {
      expect(UserSurvey("")).tobe("");
    });
    test("Return var props to be 'Test'", () => {
      expect(UserSurvey("Test")).tobe("Test");
    });
    test("Return verification of '' as false", () => {
      expect(VerifyInput('')).tobe(false);
    });
    test("Return verification of '0' as false", () => {
      expect(VerifyInput('0')).tobe(false);
    });
    test("Return verification of '1' as true", () => {
      expect(VerifyInput('1')).tobe(true);
    });
    test("Return verification of 'yippee' as false", () => {
      expect(VerifyInput("yippee")).tobe(false);
    });
    test("Return input as the correct integer", () => {
      expect(VerifyInput('1')).tobe(1);
    });
    test("Return input as the incorrect integer", () => {
      expect(VerifyInput('9')).tobe(0);
    });

    // TODO
    // Implement a simple settings panel to disable the popup
    // Currently, user can just disable plugin in plugin manager

  };
