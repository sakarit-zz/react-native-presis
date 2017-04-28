import React from 'react'
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native'
import MapView from 'react-native-maps'


function getCoordinates() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({coords: {latitude, longitude}}) => resolve({latitude, longitude}),
      reject,
      {
        enableHighAccuracy: true, 
        timeout: 20000,
        maximumAge: 1000
      }
    )
  })
}


export default class App extends React.Component {

  constructor(props, context) {
    super(props, context)

    this.state = {
      coordinates: null,
      marker: null
    }
  }

  async componentWillMount() {
    try {
      const coordinates = await getCoordinates()
      this.setState({coordinates})
    } catch(err) {
      alert(JSON.stringify(err))
    }
  }

  render() {
    const {coordinates, marker} = this.state

    return (
      <View style={styles.container}>

        {coordinates ?
          <MapView
            ref="map"
            style={styles.map}
            initialRegion={{
              ...coordinates,
              latitudeDelta: .05,
              longitudeDelta: .05
            }}
          >
            {marker ?
              <MapView.Marker coordinate={marker} /> : null}
          </MapView> : null}

        <View style={styles.buttons}>
          <TouchableHighlight
            underlayColor="white"
            activeOpacity={.75}
            onPress={() => this.locate()}
            style={styles.button}
          >
            <View style={styles.buttonView}>
              <Text style={styles.buttonText}>Locate</Text>
            </View>
          </TouchableHighlight>
        </View>

      </View>
    )
  }

  async locate() {
    const
      {map} = this.refs,
      coordinates = await getCoordinates()

    try {
      map.animateToCoordinate(coordinates, 1000)
      this.setState({marker: coordinates})
    } catch(err) {
      alert(JSON.stringify(err))
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#777',
  },
  map: {
    flex: 1,
    alignSelf: 'stretch',
  },
  buttons: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 15,
    alignItems: 'center',
  },
  button: {
    borderRadius: 25,
  },
  buttonView: {
    width: 200,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  }
})
