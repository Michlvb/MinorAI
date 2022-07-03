import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Modal, Pressable } from 'react-native';

import * as tf from '@tensorflow/tfjs';
import {cameraWithTensors} from '@tensorflow/tfjs-react-native';
import { useState, useEffect } from 'react';

import Constants from 'expo-constants';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';

// const modelWeights = require()

export default function App() {

const [isTfReady, setTf] = useState(false);
const [predictionFound, setPredictionFound] = useState(false);
const [hasPermission, setHasPermission] = useState(null);
const [modalVisible, setModalVisible] = useState(true);

const modelJSON    = require("./models/model.json")
// const modelWeights = require("./models/group1-shard1of3.bin")

//Tensorflow and Permissions
const [model, setModel] = useState(null);
const [frameworkReady, setFrameworkReady] = useState(false);

const TensorCamera = cameraWithTensors(Camera);

let requestAnimationFrameId = 0;

const textureDims = Platform.OS === "ios"? { width: 1080, height: 1920 } : { width: 1600, height: 1200 };
const tensorDims = { width: 152, height: 200 }; 

  useEffect(() => {
    if (!frameworkReady) {
      (async () => {
        const { status } = await Camera.requestPermissionsAsync();

        setHasPermission(status === 'granted')
        
        await tf.ready();
        await tf.setBackend();

        setModel(await loadModel());

        setFrameworkReady(true);
      })
    }
  }, [])
  
  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestAnimationFrameId);
    };
  }, [requestAnimationFrameId]);

const loadModel = async () => {
  console.log("WHAT IS GOING ON????")
  const model = await tf.loadGraphModel(modelJSON)
  console.log(`check model: ${model}`, model )
  return model;
}

const getPrediction = async(tensor) => {
  if (!tensor) {return;}

  console.log(`tensor stuff: ${JSON.stringify(tensor)}`)
}

const handleCameraStream = (imageAsTensors) => {
  const loop = async () => {
    const nextImageTensor = await imageAsTensors.next().value;
    await getPrediction(nextImageTensor)
    requestAnimationFrameId = requestAnimationFrame(loop)
  }
  if (!predictionFound) loop();
}

const renderView = () => {
  return <View style={styles.cameraView}>
            <TensorCamera
              style={styles.camera}
              type={Camera.Constants.Type.back}
              zoom={0}
              cameraTextureHeight={textureDims.height}
              cameraTextureWidth={textureDims.width}
              resizeHeight={tensorDims.height}
              resizeWidth={tensorDims.width}
              resizeDepth={3}
              onReady={(imageAsTensors) => handleCameraStream(imageAsTensors)}
              autorender={true}
              />
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>Welcome to Veggie A.I.!</Text>
                    <Text style={styles.modalText}>Your partner when it comes to finding the cheapest prices for vegetables🥕 and fruit🥝</Text>
                    <Text style={styles.modalText}>Point your camera at the product and find out where you can get it for cheap!</Text>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Text style={styles.textStyle}>Close</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
              <Text style={styles.legendTextField}>Checl</Text>
          </View>
    }

  return (
    <View style={styles.container}>
      {renderView()}
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#E8E8E8',
  },
  header: {
    backgroundColor: '#41005d'
  },
  title: {
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff'
  },
  body: {
    padding: 5,
    paddingTop: 25
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  cameraView: {
    display: 'flex',
    flex:1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  camera : {
    width: 700/2,
    height: 800/2,
    zIndex: 1,
    borderWidth: 0,
    borderRadius: 0,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 30
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'purple',
    borderStyle: 'solid',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#ffffff'
  },
});
