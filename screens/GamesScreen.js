import { useIsFocused } from "@react-navigation/native";
import * as React from "react";
import {View, Text, Button, FlatList, StyleSheet, TouchableHighlight} from "react-native";
import * as SQLite from "expo-sqlite";

export default function GamesScreen({navigation, route}) {

    const db = SQLite.openDatabase("Gamess.db");

    const isFocused = useIsFocused();

    const [games, setGames] = React.useState([]);

    const getData = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM Games",
                null,
                (tx, results) => {
                    setGames(results.rows._array);
                }
            )
        })
    }

    const setData = (name1, name2) => {
        try {
            db.transaction((tx)=>{
                tx.executeSql(
                    "INSERT INTO Games (Name1, Name2, Moves, Completed) VALUES (?,?,?,?)",
                    [name1, name2, JSON.stringify([]), JSON.stringify(false)],
                    (tx, results) => {
                        let existingGames = [...games];
                        existingGames.push({ID:results.insertId, Name1:name1, Name2:name2, Moves:[], Completed:false})
                        setGames(existingGames);
                    }
                );
            })

        } catch (error) {
          
        }
    }

    React.useEffect(()=>{
        console.log("Use Effect games screen");
        isFocused && getData();
    }, [isFocused]);

    return (
        
        <View style={styles.container}>

            <Button title="Log Games" onPress={()=>{console.log(games)}}/>
            <Button title="Add Game" onPress={()=>{
                setData("Name_1", "Name_2");
                console.log(games, "not doing");
            }}/>

            <FlatList style={{alignSelf: "flex-start", width: "100%"}}
                data={games}

                renderItem={({item, index, separators}) => (
                <TouchableHighlight
                    onPress={() => {
                        navigation.navigate("Scoring", {
                            item: item
                    })}}
                    onShowUnderlay={separators.highlight}
                    onHideUnderlay={separators.unhighlight}>
                    <View style={{backgroundColor: "white", justifyContent: "flex-start", alignSelf: "left", width:"100%"}}>
                        <Text style={styles.item}>{item.Name1} vs {item.Name2}</Text>
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
  