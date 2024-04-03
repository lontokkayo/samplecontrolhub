import React, { useState, useEffect } from 'react';
import { Button, View, Text, FlatList } from 'react-native';
import Papa from 'papaparse';
import Encoding from 'encoding-japanese';




const data = [
    {
        "仕入No.": 2024030011,
        "排気量": 1400,
    },
    // {
    //     "仕入No.": 2024030011,
    //     "状況": "在庫",
    //     "車名": "ベルタ",
    //     "グレード": "1.3G 1.3G",
    //     "色": "Silver",
    //     "型式": "DBA-SCP92",
    //     "年式": "H18/09",
    //     "ボディ形状": "ｾﾀﾞﾝ",
    //     "排気量": 1300,
    //     "ミッション": null,
    //     "エンジン区分": "ガソリン",
    //     "車台番号": "SCP92-1022093",
    //     "装備": "Anti-Lock Brakes・Driver Airbag・Passenger Airbag・A/C:front・Power Steering・Power Windows・Rear Window Defroster・AM/FM Radio・AM/FM Stereo・CD Player・Premium Sound・Alloy Wheels・Power Door Locks・Power Mirrors・No accidents・Non-smoker",
    //     "車輌用途": null,
    //     "車検": null,
    //     "走行距離": 57817,
    //     "長さ": 4300,
    //     "幅": 1690,
    //     "高さ ": 1460,
    //     "仕入日": "04/03/2024",
    //     "仕入区分": "ＡＡ",
    //     "仕入先": "TAA兵庫",
    //     "仕入担当": "北村祐亮",
    //     "仕入店舗": "書類未入庫",
    //     "仕入価格(税込)": 235400,
    //     "仕入価格(税抜)": 214000,
    //     "経費計": 15950,
    //     "加修費計": 0,
    //     "輸出検査料": 0,
    //     "課税仕入額": 228500,
    //     "消費税額": 22850, 
    //     "仕入合計金額": 251350,
    //     "自動車税": 0,
    //     "リサイクル料": 10280,
    //     "展示場所": "輸出(神戸）",
    //     "販売担当": "y.kitamura",
    // },
    // {
    //     "仕入No.": 2024030019,
    //     "状況": "在庫",
    //     "車名": "カローラアクシオ",
    //     "グレード": "G 1.5 G",
    //     "色": "Gold",
    //     "型式": "DBA-NZE141",
    //     "年式": "H23/07",
    //     "ボディ形状": "ｾﾀﾞﾝ",
    //     "排気量": 1500,
    //     "ミッション": null,
    //     "エンジン区分": "ガソリン",
    //     "車台番号": "NZE141-3003061",
    //     "装備": "Anti-Lock Brakes・Driver Airbag・Passenger Airbag・A/C:front・Navigation System・Power Steering・Remote Keyless Entry・Power Windows・Rear Window Defroster・AM/FM Radio・AM/FM Stereo・CD Player・Premium Sound・Power Door Locks・Power Mirrors・No accidents・One owner・Non-smoker", "車輌用途": null, "車検": null, "走行距離": 9851, "長さ": 4410, "幅": 1695, "高さ ": 1460,
    //     "仕入日": "04/03/2024",
    //     "仕入区分": "ＡＡ",
    //     "仕入先": "JU東京",
    //     "仕入担当": "森川",
    //     "仕入店舗": "書類未入庫",
    //     "仕入価格(税込)": 396000,
    //     "仕入価格(税抜)": 360000,
    //     "経費計": 19635,
    //     "加修費計": 0,
    //     "輸出検査料": 0,
    //     "課税仕入額": 377850,
    //     "消費税額": 37785,
    //     "仕入合計金額": 415635,
    //     "自動車税": 0,
    //     "リサイクル料": 10620,
    //     "展示場所": "輸出（横浜）",
    //     "販売担当": "y.kitamura"
    // }
]




const ParseCSV = () => {
    const [csvData, setCsvData] = useState([]);
    const [data, setData] = useState([]);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const codes = new Uint8Array(e.target.result);
            // Convert from SHIFT_JIS to UNICODE
            const unicodeString = Encoding.codeToString(Encoding.convert(codes, 'UNICODE', 'SJIS'));
            // Parse CSV using PapaParse
            Papa.parse(unicodeString, {
                header: true,
                dynamicTyping: true,
                complete: async function (results) {
                    console.log('Parsed results:', results);
                    setCsvData(results.data);

                    // Iterate over each row and add to the server
                    results.data.forEach(async (row) => {
                        try {
                            const documentId = row['仕入No.']; // Get the value of 仕入No. field
                            const response = await fetch('http://192.168.24.126:7000/addVehicleData', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'username': 'rmj-marc',
                                    'accessKey': 'U2FsdGVkX1+ZE9ufgN17Tr4SbuH1B3ehEDMHs4hn6pY=',
                                },
                                body: JSON.stringify({
                                    documentId: documentId,
                                    documentData: row,
                                }) // Include documentId in the request body
                            });
                            if (response.ok) {
                                console.log('Data added successfully:', row);
                            } else {
                                console.error('Failed to add data:', response.status);
                            }
                        } catch (error) {
                            console.error('Error adding data:', error);
                        }
                    });

                }
            });
        };
        reader.readAsArrayBuffer(file);
    };

    const convertToFirestoreDocument = (row) => {
        // Define the mapping of CSV keys to Firestore keys
        const mapping = {
            '仕入No.': 'documentId',
            '状況': 'status',
            '車名': 'carName',
            'グレード': 'grade',
            '色': 'color',
            '型式': 'model',
            '年式': 'year',
            'ボディ形状': 'bodyShape',
            '排気量': 'displacement',
            'ミッション': 'transmission',
            'エンジン区分': 'engineType',
            '車台番号': 'chassisNumber',
            '装備': 'equipment',
            '車輌用途': 'vehiclePurpose',
            '車検': 'inspection',
            '走行距離': 'mileage',
            '長さ': 'length',
            '幅': 'width',
            '高さ ': 'height',
            '仕入日': 'purchaseDate',
            '仕入区分': 'purchaseCategory',
            '仕入先': 'purchaseSource',
            '仕入担当': 'purchaseContact',
            '仕入店舗': 'purchaseStore',
            '仕入価格(税込)': 'purchasePriceInclusiveTax',
            '仕入価格(税抜)': 'purchasePriceExclusiveTax',
            '経費計': 'expenseTotal',
            '加修費計': 'repairCostTotal',
            '輸出検査料': 'exportInspectionFee',
            '課税仕入額': 'taxablePurchaseAmount',
            '消費税額': 'consumptionTaxAmount',
            '仕入合計金額': 'totalPurchaseAmount',
            '自動車税': 'automobileTax',
            'リサイクル料': 'recycleFee',
            '展示場所': 'exhibitionPlace',
            '販売担当': 'salesContact'
        };
        // Create the Firestore document object
        const firestoreDocument = {};
        for (const [csvKey, firestoreKey] of Object.entries(mapping)) {
            if (row[csvKey]) {
                // Special handling for numeric values
                if (csvKey === '仕入No.') {
                    firestoreDocument[firestoreKey] = parseInt(row[csvKey]);
                } else if (csvKey === '車検') {
                    // Handle 'null' values for Firestore
                    firestoreDocument[firestoreKey] = row[csvKey] === 'null' ? null : row[csvKey];
                } else {
                    firestoreDocument[firestoreKey] = row[csvKey];
                }
            }
        }

        return firestoreDocument;
    };

    const handlePressUpdate = async () => {

        data.forEach(async (row) => {
            try {
                const documentId = row['仕入No.']; // Get the value of 仕入No. field
                const response = await fetch('http://192.168.24.126:7000/updateVehicleData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'username': 'rmj-marc',
                        'accessKey': 'U2FsdGVkX1+ZE9ufgN17Tr4SbuH1B3ehEDMHs4hn6pY=',
                    },
                    body: JSON.stringify({
                        documentId: documentId,
                        documentData: row,
                    }) // Include documentId in the request body
                });
                if (response.ok) {
                    console.log('Data updated successfully:', row);
                } else {
                    console.error('Failed to update data:', response.status);
                }
            } catch (error) {
                console.error('Error updating data:', error);
            }
        });

    }


    // useEffect(async () => {
    //     try {
    //         await fetch('http://localhost:7000');
    //         // await fetch('http://rmj-api.duckdns.org:7000');
    //         // const jsonData = await response.json();
    //         // setData(jsonData);
    //     } catch (error) {
    //         console.error('Error fetching data: ', error);
    //     }
    // }, []);


    const sendData = async () => {
        // const response = await fetch('http://rmj-api.duckdns.org:7000', {
        const response = await fetch('http://localhost:7000/', {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // "tokenkey": "0iXRkSCDfNwO",
                action_cd: "update",
                stock_id: "179924",
                status: "Sold",
                reference_no: "Y2023080140A-21",
                m_as_maker_id: "59",
                m_as_model_id: "1343",
                grade_name: "116i 右ﾊﾝﾄﾞﾙ",
                model_code: "GH-UF16",
                frame_number: "WBAUF12060PZ31920",
                model_number: "15016",
                devision_number: "0001",
                registration_year: "2006",
                registration_month: "08",
                manufacture_year: "",
                manufacture_month: "",
                m_as_bodytype_id: "5",
                m_bodystyle_sub_id: "",
                length: "4240",
                width: "1750",
                height: "1430",
                displacement: "1600",
                mileage_odometer_cd: "0",
                mileage: "73255",
                m_as_fueltype_id: "1",
                m_as_transmission_id: "1",
                m_as_steering_id: "2",
                m_as_drivetype_id: "2",
                number_of_passengers: "5",
                door_cnt: "5",
                exterior_color_cd: "22",
                interior_color_cd: "",
                option_cds: "[1,2,3,4,6,9,10,11,18,19,20,21,22,23,25,26,30,31,32,41]",
                condition_cd: "0",
                accident_flg: "0",
                sales_person_charge_id: "42",
                storage_yard_cd: "4",
                site_sales_pr_text: "",
                fob_ask_flg: "0",
                fob_regular_price: "120000",
                fob_price: "120000",
                display_site_cds: "[RMJ,RMZ]",
                tcv_flg: "1",
                m_tcv_maker_id: "23",
                m_tcv_model_id: "5355",
                memo: "取・ﾅﾋﾞ取・ﾘﾓｺﾝ・ＳＤ　仕⼊れ︓￥60000",
                stock_no: "2023080140",
                stock_price: "60000",
                car_condition_file: "179924-vehicle_state.jpg"
            })
        });

        if (response.ok) {
            let responseData;
            responseData = await response.json();
            console.log('Success:', responseData);

        } else {
            console.log('HTTP-Error:', response.status);
            try {
                const errorResponse = await response.text();
                console.log('Error response:', errorResponse);
            } catch (error) {
                console.log('Error reading error response:', error);
            }
        }
    };



    const YOUR_SERVER_ENDPOINT = 'http://rmj-api.duckdns.org:7000';

    const callApiR02 = async (json_data, msg, exec_time) => {
        try {
            const data_post = JSON.parse(json_data); // Assuming json_data is a valid JSON string

            const response = await fetch(YOUR_SERVER_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: json_data, // sending raw JSON string
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json(); // Assuming the server responds with JSON

            // Check if 'ret_text' is undefined before calling replace()
            let ret_text = data.ret_text ? data.ret_text.replace(/\n/g, '\n') : 'No return text provided';
            let ret = data.ret === true ? 'Success\n' : 'Error\n';

            return ret + ret_text;

        } catch (error) {
            console.error('API call failed:', error);
            return 'Error: ' + error.message; // In a real app, you might want to update state with this message
        }
    };

    const jsonData = JSON.stringify({
        // "tokenkey": "0iXRkSCDfNwO",
        action_cd: "update",
        stock_id: "179924",
        status: "Sold",
        reference_no: "Y2023080140A-21",
        m_as_maker_id: "59",
        m_as_model_id: "1343",
        grade_name: "116i 右ﾊﾝﾄﾞﾙ",
        model_code: "GH-UF16",
        frame_number: "WBAUF12060PZ31920",
        model_number: "15016",
        devision_number: "0001",
        registration_year: "2006",
        registration_month: "08",
        manufacture_year: "",
        manufacture_month: "",
        m_as_bodytype_id: "5",
        m_bodystyle_sub_id: "",
        length: "4240",
        width: "1750",
        height: "1430",
        displacement: "1600",
        mileage_odometer_cd: "0",
        mileage: "73255",
        m_as_fueltype_id: "1",
        m_as_transmission_id: "1",
        m_as_steering_id: "2",
        m_as_drivetype_id: "2",
        number_of_passengers: "5",
        door_cnt: "5",
        exterior_color_cd: "22",
        interior_color_cd: "",
        option_cds: "[1,2,3,4,6,9,10,11,18,19,20,21,22,23,25,26,30,31,32,41]",
        condition_cd: "0",
        accident_flg: "0",
        sales_person_charge_id: "42",
        storage_yard_cd: "4",
        site_sales_pr_text: "",
        fob_ask_flg: "0",
        fob_regular_price: "120000",
        fob_price: "120000",
        display_site_cds: "[RMJ,RMZ]",
        tcv_flg: "1",
        m_tcv_maker_id: "23",
        m_tcv_model_id: "5355",
        memo: "取・ﾅﾋﾞ取・ﾘﾓｺﾝ・ＳＤ　仕⼊れ︓￥60000",
        stock_no: "2023080140",
        stock_price: "60000",
        car_condition_file: "179924-vehicle_state.jpg"
    })

    const handleCallApi = async () => {
        const result = await callApiR02(jsonData, '...', '...');
    }

    return (

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{ marginBottom: 20 }}
            />

            <View>
                {csvData.map((row, index) => (
                    <Text key={index}>
                        {JSON.stringify(row)}
                    </Text>
                ))}
            </View>

            <Button
                style={{ width: 100 }}
                // onPress={handlePressUpdate}
                onPress={sendData}
            // onPress={handleCallApi}
            >
                <Text>Press to update</Text>
            </Button>

            <View>
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View>
                            <Text>{item.columnName}</Text> {/* Replace columnName with actual data column name */}
                        </View>
                    )}
                />
            </View>
        </View>


    );
};

export default ParseCSV;
