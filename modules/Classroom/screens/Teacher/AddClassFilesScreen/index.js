import React from "react";
import { View } from "react-native";
import { Subheading } from "react-native-paper";
import AppHeader from "src/components/AppHeader";

/**
 * Parameter list
 *
 * @param {string} classId
 */
export default class AddClassFilesScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ flex:1, backgroundColor: "#E8EEE8" }}>
       <AppHeader
          navigation={this.props.navigation}
          title="Tambah Berkas"
          style={{ backgroundColor: "white" }}
        />
        <View style={{ padding:32 }}>
          <Subheading style={{fontWeight: "700"}}>Untuk melakukan penambahan berkas silahkan mengikuti langkah-langkah berikut ini</Subheading>
          <Subheading>1. Kunjungi situs https://mono.app</Subheading>
          <Subheading>2. Lakukan Login di website</Subheading>
          <Subheading>3. Pilih ikon + untuk menambah berkas</Subheading>
          <Subheading>4. Pilih berkas yang ingin ditambahkan</Subheading>
          <Subheading>5. Klik "Simpan/Tambah" berkas</Subheading>
        </View>
      </View>
    );
  }
}
