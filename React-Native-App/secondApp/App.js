import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, Alert } from 'react-native';
import { SearchBar } from 'react-native-elements';


export default class App extends Component {
  constructor() {
    super()
    this.state = {
      List: [],
      status: "Add",
      btnColor: "green",
      search: '',
    };
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  async componentDidMount() {
    if (this.state.search == '') {
      try {
        const apiCall = await fetch('http://192.168.43.70:3000/computers');
        const computers = await apiCall.json();
        console.log(computers);
        this.setState({ List: computers });
      } catch (err) {
        console.log("Error fetching data-----------", err);
      }
    }
  }

  render() {
    const { search } = this.state;
    return (
      <ScrollView keyboardShouldPersistTaps={"always"} contentContainerStyle={styles.contentContainer} ref={re => this.scroll = re}>
        <SearchBar
          placeholder="Type name of computer"
          onChangeText={this.updateSearch}
          value={search}
        />

        <View>
          <View style={styles.form}>
            <Text style={{ margin: 10, fontSize: 25 }}>To {this.state.status}: </Text>
            <TextInput style={styles.inputF} placeholder="Name" onChangeText={input => this.setState({ name: input })} value={this.state.name} ></TextInput>
            <TextInput style={styles.inputF} placeholder="Price" onChangeText={input => this.setState({ price: input })} value={this.state.price} ></TextInput>
            <TextInput style={styles.inputF} placeholder="Cpu" onChangeText={input => this.setState({ cpu: input })} value={this.state.cpu} ></TextInput>
            <TextInput style={styles.inputF} placeholder="Screen" onChangeText={input => this.setState({ screen: input })} value={this.state.screen} ></TextInput>
            <TextInput style={styles.inputF} placeholder="Ram" onChangeText={input => this.setState({ ram: input })} value={this.state.ram} ></TextInput>
            <TextInput style={styles.inputF} placeholder="Storage" onChangeText={input => this.setState({ storage: input })} value={this.state.storage} ></TextInput>
            <Button color={this.state.btnColor} title={this.state.status} onPress={() => this.submitForm()}></Button>
            {/* <Button title="DEleet" onPress={()=>this.removeComputer(1)}></Button> */}
          </View>

          {/* loop start */}
          <Text style={{ margin: 10, fontSize: 25 }}>Results: </Text>
          {this.state.List.map(computer =>
            <View style={styles.element} key={computer.id}>
              <Text style={{ fontSize: 17 }} >
                {computer.name + "\n" + computer.price + "\n" + computer.cpu + "\n" + computer.screen + "\n" + computer.ram + "\n" + computer.storage}
              </Text>
              <View style={styles.buttons}>
                <View style={styles.update}>
                  <Button title="edit" color='#0569E8' onPress={() => this.clickedEdit(computer.id)}></Button>
                </View>
                <View style={styles.delete}>
                  <Button title="delete" color='#FF262E' onPress={() => this.removeComputer(computer.id)}></Button>
                </View>
              </View>
            </View>
          )}
          {/* loop end */}
        </View>
      </ScrollView>

    );
  }
  submitForm() {
    if (this.state.status == "Add") { //add
      this.addComputer();
    } else {  //update
      this.editComputer();
    }

    // this.setState({name: "osama"});
  }
  addComputer() {
    if (this.state.name != "" && this.state.price != "" && this.state.cpu != "" && this.state.screen != "" && this.state.ram != "" && this.state.storage != "" && this.state.name != null && this.state.price != null && this.state.cpu != null && this.state.screen != null && this.state.ram != null && this.state.storage != null) {

      fetch('http://192.168.43.70:3000/computers', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.state.name,
          price: this.state.price,
          cpu: this.state.cpu,
          screen: this.state.screen,
          ram: this.state.ram,
          storage: this.state.storage
        }),
      });

      Alert.alert("Success", "Inserted Successfully!");
      this.setState({ name: "", price: "", cpu: "", screen: "", ram: "", storage: "" });
      this.componentDidMount();
    } else {
      Alert.alert("Error!", "All fields should be filled!");
      this.componentDidMount();
    }
  }



  editComputer() {
    if (this.state.name != "" && this.state.price != "" && this.state.cpu != "" && this.state.screen != "" && this.state.ram != "" && this.state.storage != "" && this.state.name != null && this.state.price != null && this.state.cpu != null && this.state.screen != null && this.state.ram != null && this.state.storage != null) {

      fetch('http://192.168.43.70:3000/computers', {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: this.state.editedId,
          name: this.state.name,
          price: this.state.price,
          cpu: this.state.cpu,
          screen: this.state.screen,
          ram: this.state.ram,
          storage: this.state.storage
        }),
      });

      Alert.alert("Success", "Updated Successfully!");
      this.setState({ status: "Add", btnColor: "green", name: "", price: "", cpu: "", screen: "", ram: "", storage: "" });
      this.componentDidMount();

    } else {
      Alert.alert("Error!", "All fields should be filled!");
      this.componentDidMount();
    }
  }

  //to handle form shape
  clickedEdit(id) {
    this.scroll.scrollTo({ x: 0, y: 0, animated: true });
    this.setState({ editedId: id, status: "Update", btnColor: "orange" });
    return fetch('http://192.168.43.70:3000/computers/' + id)
      .then((response) => response.json())
      .then((computer) => {
        this.setState({ editedComputer: computer });
        this.setState({ name: computer.name, price: computer.price, cpu: computer.cpu, screen: computer.screen, ram: computer.ram, storage: computer.storage })
        return computer;
      })
      .catch((error) => {
        console.error(error);
      });

  }
  removeComputer(id) {
    try {
      fetch('http://192.168.43.70:3000/computers/' + id, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      });

      Alert.alert("Success", "Computer Deleted!");
      this.componentDidMount();

    } catch (err) {
      Alert.alert("Error", "Did not Delete!");
    }
  }

  updateSearch = async search => {
    this.setState({ search });
    if (search != "") {

      try {
        const response = await fetch('http://192.168.43.70:3000/searchcomputers/' + search);

        const computers = await response.json();
        // Alert.alert("", JSON.stringify(computers));
        this.setState({ List: computers });
        this.componentDidMount();
        return computers;
      }
      catch (error) {
        console.error(error);
      }

    }
  }
}


const styles = StyleSheet.create({
  element: {
    margin: 3,
    padding: 3,
    backgroundColor: '#6cc6be'
  },
  buttons: {
    flexDirection: 'row'
  },
  delete: {
    flex: 1,
    width: 150,
  },
  update: {
    flex: 1,
    width: 150,
  },
  form: {
    margin: 5,
  },
  inputF: {
    padding: 15,
    paddingLeft: 20,
    elevation: 4,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "grey",
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  contentContainer: {
    paddingVertical: 20
  }
});