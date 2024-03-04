import * as React from "react";
import {View, Text, Button} from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from '@react-native-async-storage/async-storage';

// async function save(key, value) {
//     console.log("saving " + key + " " + value);
//     await SecureStore.setItemAsync(key, value);
//     console.log("saved " + value);
// }

// async function getValueFor(key) {
//     console.log("Finding value for " + key)
//     let result = await SecureStore.getItemAsync(key);

//     if (result) {
//         alert("Data found");
//         console.log(result);
//     } else {
//         alert("No data found");
//     }
// }

// let id = 0;

// const storeData = async (key, value) => {
//     try {
//       await AsyncStorage.setItem(key, value);
//     } catch (e) {
//       // saving error
//     }
// };

const storeData = async (key, value) => {
    console.log("storing " + value, (typeof value));
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      // saving error
    }
};

// const getData = async (key) => {
//     try {
//       const value = await AsyncStorage.getItem(key);
//       if (value !== null) {
//         // value previously stored
//         console.log(value)
//         console.log("got data");
//         return value;
//       }
//     } catch (e) {
//       // error reading value
//     }
// };

const getData = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        console.log("found", jsonValue);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
};

export default function HomeScreen({navigation}) {

    const init_data = [
        {name1: 'Devin', name2:'Devin', moves: []},
        {name1: 'Dan', name2:'Devin', moves: []},
        {name1: 'Dominic', name2:'Devin', moves: []},
        {name1: 'Jackson', name2:'Devin', moves: []},
        {name1: 'James', name2:'Devin', moves: []},
        {name1: 'Joel', name2:'Devin', moves: []},
        {name1: 'John', name2:'Devin', moves: []},
        {name1: 'Jillian', name2:'Devin', moves: []},
        {name1: 'Jimmy', name2:'Devin', moves: []},
        {name1: 'Julie', name2:'Devin', moves: []},
    ]

    return (
        <View style={{flex:1, alignItems: "center", justifyContent: "center"}}>
            <Text 
                // onPress={()=>alert("This is the home screen")}
                style={{fontSize:26, fontWeight: "bold"}}>Home Screen</Text>
                <Button title ="Go to games" onPress={()=>{navigation.navigate("Games", {data:init_data})}}/>
                
                <Button title = "add game" 
                    onPress={()=>{
                        const new_data = {name1: "Saxon",
                            name2:"Craig",
                            rolls:[],
                            key:(0).toString()};

                        init_data.push(new_data);
                        // save("key", new_data);
                        // save("key", "hello");

                        // storeData("key", "new_data");
                        storeData(new_data.key, new_data)
                    }}/>
                
                <Button title = "log new data"
                    onPress={()=>{
                        // getValueFor("key");

                        console.log(getData("key"));
                    }}
                />
        </View>
    );
}