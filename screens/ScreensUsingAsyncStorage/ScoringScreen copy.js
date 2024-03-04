import * as React from "react";
import {View, Text, Button} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useState, useEffect } from "react";

export default function ScoringScreen({navigation, route}) {

    const {item} = route.params;

    const [name1, changeName1] = useState(item.name1);
    const [name2, changeName2] = useState(item.name2);

    const [newName1, changeNewName1] = useState("");
    const [newName2, changeNewName2] = useState("");

    // useEffect(() => {
    //     navigation.setOptions({
    //       headerLeft: () => (
    //         <Button onPress={() => console.log("Pressed Back")} title="Back" />
    //       ),
    //     });
    // }, [navigation]);

    return (


        <View style={{
                width: "100%",
                alignItems:"center", 
                flexDirection:"column", 
                justifyContent: "flex-start", 
                padding:10
            }}>

            <Text style={{fontSize: 20}}>
                {name1} vs {name2}
            </Text>

            <View style={{
                    width:"100%",
                    flexDirection:"column",
                    alignItems:"center",
                }}>

                <View style={{
                    padding:5,
                    width:"100%",
                    flexDirection:"column",
                    alignItems:"center",
                }}>

                    <TextInput 
                        style={{backgroundColor:"white", 
                            width: "100%",
                            fontSize:15,
                            height: 40,
                            padding: 10, 
                            borderRadius:10}}

                        placeholder={"Name 1"} 
                        value = {newName1}
                        onChange={(event) => {
                            changeNewName1(event.nativeEvent.text);
                        }}
                        onSubmitEditing={(event) => {
                            if (event.nativeEvent.text === "") {
                                return;
                            }
                            item.name1 = event.nativeEvent.text;
                            navigation.setParams(item);
                            changeName1(item.name1);
                            changeNewName1("");
                        }}
                    />
                </View>
                
                <View style={{
                    padding:5,
                    width:"100%",
                    flexDirection:"column",
                    alignItems:"center",
                }}
                >
                    <TextInput 
                        style={{backgroundColor:"white", 
                            width: "100%", 
                            height: 40,
                            fontSize:15,
                            padding: 10, 
                            borderRadius:10}} 
                        placeholder={"Name 2"}
                        value = {newName2}
                        onChange={(event) => {
                            changeNewName2(event.nativeEvent.text);
                        }}
                        onSubmitEditing={(event) => {
                            if (event.nativeEvent.text === "") {
                                return;
                            }
                            item.name2 = event.nativeEvent.text;
                            navigation.setParams(item);
                            changeName2(item.name2);
                            changeNewName2("");
                        }}
                    />
                </View>
            </View>
        </View>
    );
}