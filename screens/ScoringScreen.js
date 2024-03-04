import * as React from "react";
import {View, Text, Button, StyleSheet, TouchableHighlight} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";

export default function ScoringScreen({navigation, route}) {
    
    const db = SQLite.openDatabase("Gamess.db");
    const testing = false;
    const itemID = route.params.item.ID;

    const [loading, changeLoading] = useState(true);
    const [editing, setEditing] = useState(true);
    
    const [item, setItem] = useState({});
    const [selectedValues, setSelectedValues] = useState([]);
    const [totalMoves, setTotalMoves] = useState([0,0]);
    const [moves, setMoves] = useState(
        typeof route.params.item.Moves === "string" ? JSON.parse(route.params.item.Moves) : route.params.item.Moves
    );
    const [completed, changeCompleted] = useState(
        typeof route.params.item.Completed === "string" ? JSON.parse(route.params.item.Completed) : route.params.item.Completed
    );

    const [name1, changeName1] = useState(route.params.item.Name1);
    const [name2, changeName2] = useState(route.params.item.Name2);
    const [newName1, changeNewName1] = useState("");
    const [newName2, changeNewName2] = useState("");

    function calcMoves(m) {
        const tot_moves = [0,0];
        for (let i = 0; i < m.length; i+=2) {
            let score = 0;

            if ( m[i] === m[i+1] ) {
                score += m[i] + m[i+1];
            }

            score += m[i] + m[i+1];
            tot_moves[Math.floor(i/2)%2] += score;

        }
        setTotalMoves(tot_moves);
    }


    React.useEffect(()=>{
        console.log("Use Effect scoring screen")
        getData();
        calcMoves(moves);
        
        changeLoading(false);
    }, []);

    const getData = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM Games WHERE ID = ?", 
                [itemID],
                (tx, results) => {
                    setItem(...results.rows._array);
                }
            )
        })
    }

    const changeData = (set_var, val) => {
        if (set_var === "Moves" || set_var === "Completed") {
            val = JSON.stringify(val);
        }

        db.transaction((tx)=>{
            tx.executeSql(
                "UPDATE Games SET " + set_var + " = ? WHERE ID = ?",
                [val, itemID]
            );
        })
    }

    const deleteItem = () => {
        db.transaction((tx)=>{
            tx.executeSql("DELETE FROM Games WHERE ID = ?", [itemID]);
        })
    }


    
    function addValue(val) {
        if (selectedValues.length === 2) {
            return;
        }
        
        const vals = [...selectedValues];
        vals.push(val);
        setSelectedValues(vals);
    }
    function deleteValue() {
        if (selectedValues.length === 0) {
            return;
        }
        
        const vals = [...selectedValues];
        vals.pop();
        setSelectedValues(vals);
    }
    
    function deleteMove() {
        if (moves.length === 0 || completed) {
            return;
        }
        const curr_moves = [...moves];
        curr_moves.pop();
        curr_moves.pop();
        
        calcMoves(curr_moves);
        setMoves(curr_moves);
        changeData("Moves", curr_moves);
    }
    
    function enterValue() {
        if (selectedValues.length !== 2 || completed) {
            return;
        }
        
        if (selectedValues[0] > selectedValues[1]) {
            temp = selectedValues[0];
            selectedValues[0] = selectedValues[1];
            selectedValues[1] = temp;
        }
        
        const curr_moves = [...moves];
        curr_moves.push(...selectedValues);
        setMoves(curr_moves);
        setSelectedValues([]);
        
        changeData("Moves", curr_moves);
        calcMoves(curr_moves);
    }
    
    function setCompleted() {
        changeData("Completed", !completed);
        changeCompleted(!completed);
    }
    
    function getMoves(player) {
        if ((moves.length === 0 && player === 1) || (moves.length < 3 && player === 2)) {
            return "No moves";
        }
        
        let i = 0;
        if (player === 2) {
            i = 2;
        }
        
        let str = "[ " + moves[i+1] + "," + moves[i];
        
        i+=4;
        for (; i < moves.length; i+=4) {
            str = str + " : " + moves[i+1] + "," + moves[i];
        }
        
        return str + " ]";
    }

    if (loading) {
        return (
            <View style={{alignItems: "center", justifyContent: "space-evenly"}}><Text>Loading...</Text></View>
        )
    }
    
    return (
        
        <View style={styles.container}>

            <View style={styles.mainView}>

                <Text style={{fontSize: 20}}>
                    {name1} vs {name2}
                </Text>

                <Text>{name1}: {totalMoves[0]}, {name2}: {totalMoves[1]}</Text>

                {editing &&
                <View style={styles.textInContainer}>

                    <TextInput 
                        style={styles.textIn}

                        placeholder={"White"} 
                        value = {newName1}
                        onChange={(event) => {
                            changeNewName1(event.nativeEvent.text);
                        }}
                        onSubmitEditing={(event) => {
                            if (event.nativeEvent.text === "") {
                                return;
                            }
                            item.Name1 = event.nativeEvent.text;
                            changeName1(item.Name1);
                            changeNewName1("");
                            changeData("Name1", item.Name1);
                        }}
                    />

                    <TextInput 
                        style={styles.textIn} 
                        placeholder={"Black"}
                        value = {newName2}
                        onChange={(event) => {
                            changeNewName2(event.nativeEvent.text);
                        }}
                        onSubmitEditing={(event) => {
                            if (event.nativeEvent.text === "") {
                                return;
                            }
                            item.Name2 = event.nativeEvent.text;
                            changeName2(item.Name2);
                            changeNewName2("");
                            changeData("Name2", item.Name2);
                        }}
                    />
                </View>}
                
                {testing && <Button title="Log item" onPress={()=>{console.log("logging", item, name1, typeof item.Moves); setSelectedValues([])}}/>}
                <Button title="Toggle Edit" onPress={()=>{setEditing(!editing)}}/>
                <Button title="Delete item" onPress={()=>{
                    // deleteItem();
                    // navigation.pop();
                }}/>
                <Button title="delete move" onPress={()=>{deleteMove()}}/>
                <Button title="Finish Game" onPress={()=>{setCompleted()}}/>
                <View>
                    <Text style={{fontSize:20}}>{name1}'s Rolls: {getMoves(1)}</Text>
                    <Text style={{fontSize:20}}>{name2}'s Rolls: {getMoves(2)}</Text>
                </View>

            </View>

            {!completed && <View style={styles.footer}>
                    <View style={styles.showSelectedVals}>
                        <Text>
                            {selectedValues.length === 0 ? "" : (selectedValues.length === 1 ? selectedValues[0] : selectedValues[0] + ", " + selectedValues[1])}
                        </Text>
                    </View>

                    <View style={styles.buttonRows}>
                        <TouchableHighlight style={styles.buttons} onPress={()=>{console.log(1); addValue(1);}}><View style={styles.die}><Text>1</Text></View></TouchableHighlight>
                        <TouchableHighlight style={styles.buttons} onPress={()=>{console.log(2); addValue(2);}}><View style={styles.die}><Text>2</Text></View></TouchableHighlight>
                        <TouchableHighlight style={styles.buttons} onPress={()=>{console.log(3); addValue(3);}}><View style={styles.die}><Text>3</Text></View></TouchableHighlight>
                        <TouchableHighlight style={styles.buttons} onPress={()=>{console.log("Delete"); deleteValue();}}><View style={styles.button}><Text>Delete</Text></View></TouchableHighlight>
                    </View>

                    <View style={styles.buttonRows}>
                        <TouchableHighlight style={styles.buttons} onPress={()=>{console.log(4); addValue(4);}}><View style={styles.die}><Text>4</Text></View></TouchableHighlight>
                        <TouchableHighlight style={styles.buttons} onPress={()=>{console.log(5); addValue(5);}}><View style={styles.die}><Text>5</Text></View></TouchableHighlight>
                        <TouchableHighlight style={styles.buttons} onPress={()=>{console.log(6); addValue(6);}}><View style={styles.die}><Text>6</Text></View></TouchableHighlight>
                        <TouchableHighlight style={styles.buttons} onPress={()=>{console.log("Enter"); enterValue()}}><View style={styles.button}><Text>Enter</Text></View></TouchableHighlight>
                    </View>
            </View>}

        </View>

    );
}

const styles = StyleSheet.create({

    showSelectedVals:{
        flex:1,
        backgroundColor:"white",
        borderRadius:10,
        width:"30%",
        justifyContent:"center",
        alignItems:"center",
    },

    container: {
        width: "100%",
        height: "100%",
        justifyContent:"space-between",
        padding:20,
        gap:5,
        backgroundColor: "white",
    },

    textIn:{
        backgroundColor:"white", 
        width: "100%", 
        height: 40,
        fontSize:15,
        padding: 10, 
        borderRadius:10
    },

    textInContainer:{
        padding:5,
        width:"100%",
        flexDirection:"column",
        alignItems:"center",
        gap: 10
    },

    mainView: {
        gap:5,
        width: "100%",
        alignItems:"center", 
        flexDirection:"column", 
        justifyContent: "flex-start", 
        padding:0,
        flex:3
    },

    buttonRows:{
        flexDirection:"row",
        width:"100%",
        justifyContent:"space-around",
        alignItems:"center",
        flex:2,
    },

    buttons:{
        flex:1,
        padding:5,
        alignItems:"stretch",
    },

    button:{
        flex:1,
        backgroundColor:"white",
        alignItems:"center",
        justifyContent:"center",
        borderRadius:10,
    },

    die:{
        flex:1,
        backgroundColor:"#1ff",
        alignItems:"center",
        justifyContent:"center",
        borderRadius:10,
    },

    footer: {
        flex:1,
        width:"100%",
        padding:5,
        backgroundColor:"black",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        borderRadius:10,
    }
  });
  