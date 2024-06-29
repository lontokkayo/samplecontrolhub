import React, { useState, useEffect, useRef } from 'react';
import { Button, View, Text, FlatList, ScrollView } from 'react-native';
import Papa from 'papaparse';
import Encoding from 'encoding-japanese';
import axios from 'axios';
import moment from 'moment';
import { TextInput } from 'react-native-gesture-handler';

// Function to send email
const sendEmail = async (to, subject, htmlContent) => {


    try {
        const response = await fetch('https://rmjsmtp.duckdns.org/emailServer/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to,
                subject,
                htmlContent,
            }),
        });

        if (response.ok) {
            console.log('Email sent successfully to:', to);

        } else {
            console.error('Failed to send email to:', to);
        }
    } catch (error) {
        console.error('Error sending email to:', to, error);
    }
};


const RegisterSuccessNotif = () => {
    const [newArrivalsHtmlContent, setNewArrivalsHtmlContent] = useState(null);
    const nameInputRef = useRef(null);
    const [successList, setSuccessList] = useState([]); // To track successfully sent emails

    useEffect(() => {
        fetch(`https://rmjsmtp.duckdns.org/rmjNewVehiclesServer/api/proxy?url=${encodeURIComponent('https://www.realmotor.jp/car_list/All/All/All/')}`, {
            // fetch(`http://localhost:3000/api/proxy?url=${encodeURIComponent('https://www.realmotor.jp/car_list/All/All/All/')}`, {
        })
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, "text/html");

                // Add the base URL to ensure relative URLs are resolved correctly.
                const base = document.createElement('base');
                base.href = 'https://www.realmotor.jp/car_list/All/All/All/';
                doc.head.insertBefore(base, doc.head.firstChild);

                // Optional: Inline external CSS for cross-origin stylesheets
                const stylesheets = doc.querySelectorAll('link[rel="stylesheet"]');
                Array.from(stylesheets).forEach(link => {
                    // You might need to fetch and inline CSS content here, which can be complex and subject to CORS policies.
                    // This step is complex and requires a server-side component or CORS-enabled endpoint.
                });

                // Serialize the document back to a string
                const serializer = new XMLSerializer();
                let serializedDoc = serializer.serializeToString(doc);
                setNewArrivalsHtmlContent(serializedDoc);
                console.log(serializedDoc)
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);


    const handleFileChange = async (event) => {
        const fileInput = event.target; // Get a reference to the file input element

        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('MMMM D, YYYY');

        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                Papa.parse(text, {
                    header: true,
                    complete: (results) => {
                        console.log('Parsed CSV:', results.data);
                        let successfulEmails = [];
                        results.data.forEach(row => {
                            if (row.email !== '') {
                                const emailContent = `
                                    <!DOCTYPE html>
                                    <html lang="en">
                                    <head>
                                        <meta charset="UTF-8">
                                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                        <title>Welcome to Real Motor Japan</title>
                                    </head>
                                    <body>
                                        <p>Dear Customer,</p>
                                        <p>We have created an account for you now,</p>
                                        <p>Your login and password are your email address.</p>
                                        <p><strong>Log in:</strong> ${row.email}</p>
                                        <p><strong>Password:</strong> ${row.password}</p>
                                        <p>Please log in to the website and then change your password for security.</p>
                                        <a href="https://www.realmotor.jp">www.realmotor.jp</a>
                                        <p>Real Motor Japan<br>${nameInputRef.current.value}</p>
                                        <br> <br>
                                        ${newArrivalsHtmlContent}
                                    </body>
                                    </html>
                                `;
                                successfulEmails.push(row.email);
                                setSuccessList(prevSuccesses => [...prevSuccesses, row.email]);
                                sendEmail(row.email, `Real Motor Japan | Account Registered (${formattedTime})`, emailContent);
                            }
                        });

                        // Reset the file input after processing
                        fileInput.value = '';
                    }
                });
            };
            reader.readAsText(file);
        }
    };

    return (
        <View style={{
            marginTop: 10,
            alignSelf: 'center',
        }}>
            <View style={{
                marginTop: 10,
                alignSelf: 'center',
                marginBottom: 15,
                backgroundColor: '#F8F9FF', // Card background color
                borderRadius: 10, // Rounded corners for the card
                shadowColor: '#000', // Shadow color
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 3, // Elevation for Android
                padding: 15, // Padding inside the card
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
            }}>

                <Text
                    style={{
                        fontWeight: 'bold',
                        fontSize: 16,
                    }}>
                    Input name in charge
                </Text>
                <TextInput
                    ref={nameInputRef}
                    placeholderTextColor='#9B9E9F'
                    style={{
                        backgroundColor: 'white',
                        borderWidth: 1,
                        borderColor: '#ccc',
                        padding: 10,
                        borderRadius: 5,
                        marginBottom: 20,
                        outlineStyle: 'none',
                    }}
                    placeholder="Name"
                />
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    style={{ marginBottom: 20, padding: 10 }}
                />

            </View>

            {successList.length > 0 &&
                <ScrollView style={{
                    marginTop: 10,
                    alignSelf: 'center',
                    minHeight: 300,
                    minWidth: 300,
                    maxWidth: 300,
                    maxHeight: 700,
                    marginBottom: 15,
                    backgroundColor: '#F8F9FF', // Card background color
                    borderRadius: 10, // Rounded corners for the card
                    shadowColor: '#000', // Shadow color
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 3, // Elevation for Android
                    padding: 15, // Padding inside the card
                    borderBottomWidth: 1,
                    borderBottomColor: '#eee',
                }}>
                    {successList.map((email, index) => (
                        <View key={index} style={{
                            backgroundColor: '#d1e8d9',
                            padding: 10,
                            marginVertical: 5,
                            borderRadius: 5,
                        }}>
                            <Text style={{ color: '#333' }}>{`Email sent to:\n${email}`}</Text>
                        </View>
                    ))}
                </ScrollView>
            }

        </View>
    );
};

export default RegisterSuccessNotif;
