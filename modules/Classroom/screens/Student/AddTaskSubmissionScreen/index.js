import React from "react";
import { View } from "react-native";
import { Subheading } from "react-native-paper";
import AppHeader from "src/components/AppHeader";

/**
 * Parameter list
 *
 * @param {string} classId
 */
export default class AddTaskSubmissionScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Tambah Berkas"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };
 
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ flex:1, backgroundColor: "#E8EEE8", padding:32 }}>
        <View style={{}}>
          <Subheading style={{fontWeight: "700"}}>Untuk melakukan penambahan berkas silahkan mengikuti langkah-langkah berikut ini</Subheading>
          
          <Subheading>1. Kunjungi situs https://mono.app</Subheading>
          <Subheading>2. Pilih ikon + untuk menambah berkas</Subheading>
          <Subheading>3. Pilih berkas yang ingin ditambahkan</Subheading>
          <Subheading>4. Klik "Simpan/Tambah" berkas</Subheading>
        </View>
      </View>
    );
  }
}
