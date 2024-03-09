import React, { useState } from 'react';
import { Button, View, Text } from 'react-native';
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
                onPress={handlePressUpdate}
            >
                Press to update
            </Button>
        </View>
    );
};

export default ParseCSV;
