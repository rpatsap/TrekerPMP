import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput, Button, Keyboard, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';


const App = () => {
    const [data, setData] = useState([

    ]);

    const [sum, setSum] = useState('');
    const [place, setPlace] = useState('');

    const fetchData = () => {
        fetch('http://192.168.1.4:8080/') // LOCAL IP
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
            })
            .then((data) => {
                setData(data)
            })
            .catch((error) => {
                alert("Error: " + error);
            });
    }

    useEffect(() => {
        fetchData();
    }, []);


    const screenWidth = Dimensions.get('window').width;

    const saveData = () => {
        const newRecord = { name: place, pv: parseInt(sum), date: getCurrentDate() }
        setSum('');
        setPlace('');
        const url = 'http://192.168.1.4:8080/';  // LOCAL IP
Keyboard.dismiss();
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRecord)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                console.log('Success:', data);
                fetchData();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const chartData = {
        labels: data.map((item) => {
            const dateParts = item.date.split('/');
            return `${dateParts[1]}/${dateParts[2]}`;
        }),
        datasets: [
            {
                data: data.map((item) => item.pv),
            },
        ],
    };

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>Graph Example</Text>

            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={sum}
                onChangeText={setSum}
                placeholder="Enter sum"
            />

            <TextInput
                style={styles.input}
                value={place}
                onChangeText={setPlace}
                placeholder="Enter place"
            />

            <Button title="Save" onPress={saveData} />

            {data.map((item, index) => (
                <View key={index} style={styles.item}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text>PV: {item.pv}</Text>
                    <Text>Date: {item.date}</Text>
                </View>
            ))}

            <View style={{ height: 200, padding: 0 }}>
                <LineChart
                    data={chartData}
                    width={screenWidth - 40}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#e26a00',
                        backgroundGradientFrom: '#fb8c00',
                        backgroundGradientTo: '#ffa726',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: '6',
                            strokeWidth: '2',
                            stroke: '#ffa726',
                        },
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    heading: {
        fontSize: 24,
        marginTop: 50,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
    },
    item: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 5,
    },
    itemName: {
        fontWeight: 'bold',
    },
});
export default App;