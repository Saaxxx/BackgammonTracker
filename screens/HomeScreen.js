import * as React from "react";
import {View, Text, Button} from "react-native";
import * as SQLite from "expo-sqlite";
import { useIsFocused } from "@react-navigation/native";

export default function HomeScreen({navigation}) {

    const db = SQLite.openDatabase("Gamess.db");

    const isFocused = useIsFocused();

    const [name, setName] = React.useState(":)")
    const [allGames, setAllGames] = React.useState([])
    
    React.useEffect(()=>{
        console.log("Use Effect")
        isFocused && createTable();
        isFocused && getData();
    }, [isFocused]);

    const createTable = () => {
        db.transaction((tx)=> {
              tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                + "Games "
                + "(ID INTEGER PRIMARY KEY AUTOINCREMENT, Name1 TEXT, Name2 TEXT, Moves TEXT, Completed Text)"
           )
        })
    }
    
    const getData = () => {
        let games = [];
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM Games",
                [],
                (tx, results) => {
                    games = results.rows._array;
                    setAllGames(games);
                }
            )
        })
    }

    const setData = (name1, name2) => {
        try {
            db.transaction(async (tx)=>{
                tx.executeSql(
                    "INSERT INTO Games (Name1, Name2, Moves, Completed) VALUES (?,?,?,?)",
                    [name1, name2, JSON.stringify([]), JSON.stringify(false)]
                );
            })
        } catch (error) {
          
        }  
    }

    const deleteIDFromTable = (id) => {
        db.transaction((tx) => {
            tx.executeSql("DELETE FROM Games " + id);
        });
    }
    
    const clearTable = () => {
        db.transaction(tx => {
            tx.executeSql("DELETE FROM Games")
        })
        setAllGames([]);
    }

    function displayGames() {
        if (allGames.length === 0) {
            console.log("No games");
            return;
        }

        for (let i = 0; i < allGames.length; i++) {
            console.log((allGames[i]))
        }
    }

    return (
        <View style={{flex:1, alignItems: "center", justifyContent: "center"}}>
            <Text>{name}</Text>
            <Button title="Delete games" onPress={()=>{
                clearTable();
            }}/>

            <Button title = "display games" onPress={()=>{displayGames()}}/>
            <Button title="add game" onPress={() => {
                setData("Saxon", "Craig")
                getData()
            }}/>

            <Text 
                // onPress={()=>alert("This is the home screen")}
                style={{fontSize:26, fontWeight: "bold"}}>Home Screen</Text>
                <Button title ="Go to games" onPress={()=>{
                        // db.closeSync();
                        navigation.navigate("Games")
                    }}/>
        </View>
    );
}