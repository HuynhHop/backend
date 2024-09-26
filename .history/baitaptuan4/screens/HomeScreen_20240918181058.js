import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  TextInput,
} from "react-native";
import { useUser } from "../src/hook/userContext";
import ListItem from "../src/components/ListItem";
import debounce from "lodash.debounce";
const HomeScreen = ({ navigation }) => {
  const { user, setUser } = useUser();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.56.1:3000/product/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  // Debounced search function
  const fetchSearchResults = useCallback(
    debounce(async (query) => {
      try {
        const url =
          query.trim() === ""
            ? "http://192.168.56.1:3000/product/"
            : `http://192.168.56.1:3000/product?name=${query}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching search results", error);
      }
    }, 500),
    []
  );

  // Call the debounced search function when searchQuery changes
  useEffect(() => {
    fetchSearchResults(searchQuery);
  }, [searchQuery, fetchSearchResults]);

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    fetchSearchResults(text);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", paddingTop: 30 }}>
      <ScrollView style={{ padding: 24 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 18 }}>
            Hello, {user ? user?.fullname : "undefined"}
          </Text>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <ImageBackground
              source={require("../assets/images/user-profile.jpg")}
              style={{ width: 35, height: 35 }}
              imageStyle={{ borderRadius: 25 }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            borderColor: "#C6C6C6",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 8,
          }}
        >
          <TextInput
            placeholder="Search"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
        </View>

        <View
          style={{
            marginVertical: 15,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 18 }}>Books</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={{ color: "#0aada8" }}>See all</Text>
          </TouchableOpacity>
        </View>
        {products &&
          products.map((item) => {
            return <ListItem key={item._id} item={item}></ListItem>;
          })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
