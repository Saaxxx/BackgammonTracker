import { useIsFocused } from "@react-navigation/native";
import * as React from "react";
import {View, Text, Button, FlatList, StyleSheet, TouchableHighlight} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GamesScreen({navigation, route}) {

    // const isFocused = useIsFocused();
    const items = route.params.data;
    const [data, setData] = React.useState([]);
    let keys = [];

    const storeData = async (key, value) => {
        console.log("storing " + value, (typeof value));
        try {
          const jsonValue = JSON.stringify(value);
          await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
          // saving error
        }
    };

    const getData = async (key) => {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            setTempText(jsonValue);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
          // error reading value
        }
    };

    const addData = async (key) => {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            data.push(JSON.parse(jsonValue));
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
          // error reading value
        }
    }
    
    const addKeys = async () => {
        let values
        try {
            values = await AsyncStorage.multiGet(keys)
        } catch (error) {
            
        }

        // console.log("all keys", values)
        console.log("random log1",typeof(values[0]), values[0])

        for(let i = 0; i < values.length; i++) {
            // values[i] = JSON.parse(values[i])
            try {
                values[i] = await JSON.parse(values[i])
            } catch (e) {

            }
        }

        console.log("random log",typeof(values[0]), values[0])

        setData(values)
    }

    const getAllKeys = async () => {
        try {
          keys = await AsyncStorage.getAllKeys()
        } catch(e) {
          // read key error
        }
      
        // console.log(keys)
        // keys.forEach((key) => {
        //     addData(key);
        // })
        
        addKeys(keys)

        // example console.log result:
        // ['@MyApp_user', '@MyApp_key']
      }

      const logKeys = async () => {
        try {
          keys = await AsyncStorage.getAllKeys()
        } catch(e) {
          // read key error
        }
      
        console.log(keys)
      }

    // const [tempText, setTempText] = React.useState("None"); 
    // cosnt [keys, setKeys];
    // console.log()
    // getAllKeys();
    // console.log(keys);

    function addGame() {
        const new_data = {name1:"??", name2:"??", rolls: [], key:(data.length+1).toString()};
        storeData(new_data.key, new_data)
        console.log((data.length+1).toString())
        console.log(new_data)
        logKeys()
    }

    const clearGames = async () => {
        try {
            await AsyncStorage.clear()
        } catch (error) {
            console.error(error)
        }
    }

    React.useEffect(()=>{
        const addKeysToData = navigation.addListener("focus", () => {
            getAllKeys();
        });

        return addKeysToData;
    }, [navigation]);

    

    return (
        
        <View style={styles.container}>

        <Button title="Add Game" onPress={addGame}/>
        <Button title="Clear Games" onPress={clearGames}/>
        <Button title="Log data" onPress={()=>{console.log(data)}}/>
            {/* <Text>{tempText}</Text>

            <Button title="find data" onPress={()=>{
                // console.log("logging data from press", getData("key"));
                getData("key");
                // let sin = get_data_func("key");
                // let cos = AsyncStorage.getItem('key');
                
                // console.log()
                // console.log("logging data from press dat", dat);
                // console.log("logging data from press sin", sin);
                // console.log("logging data from press cos", JSON.parse(tempText));
            }}/> */}

            <FlatList style={{alignSelf: "flex-start", width: "100%"}}
                data={data}

                renderItem={({item, index, separators}) => (
                <TouchableHighlight
                    onPress={() => {navigation.navigate("Scoring", {
                        item: item
                    })}}
                    onShowUnderlay={separators.highlight}
                    onHideUnderlay={separators.unhighlight}>
                    <View style={{backgroundColor: "white", justifyContent: "flex-start", alignSelf: "left"}}>
                        <Text style={styles.item}>{item.name1} vs {item.name2}</Text>
                    </View>
                </TouchableHighlight>
                )}
            /> 
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'grey',
      alignItems: 'center',
      justifyContent: 'center',
      width: "100%",
      height: "100%"
    },

    text: {
        color: "black",
        fontSize: "18",
    },

    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        alignItems: "flex-start"
      },

  });
  