# Mono Application
This is a development repository. Contribution guide is really appreciated.

## Installation
Since this is a React Native application, you need to follow this [link](https://facebook.github.io/react-native/docs/getting-started). Please select `React Native CLI`. After the React Native installation has been completed, you can

- Clone this repositories `git clone`
- Go to the cloned directory and run `npm install` to install any other depedencies.

## Contribution Guideline
Of course, you need to have a basic understanding of `GitHub`. I personally use `GitKraken` to perform the `commit` and `pull request`. 

### How to Submit a `pull request`
To submit a `pull request`, you need to create a new branch and create a `pull request` from that branch. For example, you want to merge `modify-readme` branch to `master`. You can create `pull request` from the `modify-readme` branch to `master`.

### How to Code on Modules
Modules is a small application that lives inside the Mono App. There is a `modules` folder. If you are working a certain module, you need to place your code inside the `modules` folder. Folder stucture for Modules is
```
modules/
  Classroom/
    api/
    components/
    navigators/
    screens/
```
If you happen that the modules do not have that folder structure, please proceed to create.

### Styling Guide
Please use 16 as the baseline, and the increment or decrement will be 4. For example, the next size will be 32 or 8.

Please also follow the primary color in the button.

Please also use `<Text>` component from `react-native-paper`

Please refer to `issue` if you want to make ` pull request`

## Issue Tracker
It is highly appreciated if you can start a new issue and assign the issue with correct label. For a question, you can use `question` label.
  
## Submitting Issue to Pull Request
To submit an `issue` to a `pull request` you need to set your comment description using the issue number. For example `pull request to fix issue #7`. In here, `#7` is the issue number.

## Common Issue

### How to Start?
If you are not changing any native code, you can just simply run `react-native start` to start the project. However, for the first time you must run `react-native run-android`.

### What are Libraries that you are Using?
I am using a lot of libraries. 

- For navigation, please refer to `react-navigation` documentation.
- For Sensitive Information, please refer to `react-native-sensitive-information` documentation.
- For UI/UX, please refer to `react-native-paper` documentation. 
- For icons, please refer to `react-native-vector-icons` documentation.
- For Firebase integartion, please refer to `react-native-firebase` documentation and [Firebase](https://firebase.google.com) documentation.