import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from 'react-native';
import {Searchbar} from 'react-native-paper';
import {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {RootStackParamList, Note} from '../App';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '../components/theme';

type SearchProps = NativeStackScreenProps<RootStackParamList, 'Search'>;

const Search = ({route}: SearchProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Search'>>();
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? 'dark'];

  const handleEdit = (
    notes: Note[],
    title: string,
    data: string,
    index: number,
    imagePath: string,
    tags: {text: string; isSelected: boolean}[],
  ) => {
    navigation.navigate('EditNote', {
      notes,
      title: title,
      data: data,
      index: index,
      imagePath: imagePath,
      tags: tags,
    });
  };

  return (
    <SafeAreaView
      style={[styles.searchContainer, {backgroundColor: colors['secondary']}]}>
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        autoFocus
        iconColor="#216869"
      />

      <View style={styles.resultContainer}>
        <Text style={[styles.resultTitleText, {color: colors['primary']}]}>
          Results
        </Text>
        <ScrollView>
          <View>
            {route.params.notes.map((item, index) => {
              if (item.title.includes(searchQuery) && searchQuery != '') {
                console.log(item.image);
                return (
                  <TouchableOpacity
                    style={[
                      styles.resultCard,
                      {borderColor: colors['secondary']},
                    ]}
                    onPress={() =>
                      handleEdit(
                        route.params.notes,
                        item.title,
                        item.data,
                        index,
                        item.image,
                        item.tags,
                      )
                    }>
                    <View style={styles.resultCardTitleAndData}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 20,
                          color: 'black',
                        }}>
                        {item.title.length > 20
                          ? item.title.substring(0, 10) + '  ...Read more'
                          : item.title}
                      </Text>
                      <Text>
                        {item.data.length > 100
                          ? item.data.replaceAll('\n', ' ').substring(0, 100) +
                            '  ...Read more'
                          : item.data}
                      </Text>
                    </View>
                    <View style={styles.resultCardImageContainer}>
                      <Image
                        source={{uri: item.image}}
                        style={styles.resultCardImage}
                      />
                    </View>
                  </TouchableOpacity>
                );
              }
              return null;
            })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({
  searchContainer: {
    padding: 10,
    height: '100%',
    backgroundColor: 'white',
  },

  searchBar: {
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 0.7,
    borderRadius: 50,
  },

  resultContainer: {
    padding: 10,
  },

  resultTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2421',
    textAlign: 'left',
  },

  resultCard: {
    flexDirection: 'row',
    shadowColor: '#999999',
    marginVertical: 10,
    backgroundColor: 'white',
    borderColor: '#999999',
    borderWidth: 0.5,
    borderRadius: 10,
    height: 150,
  },

  resultCardTitleAndData: {
    padding: 10,
    width: '60%',
  },

  resultCardImageContainer: {
    width: '40%',
  },

  resultCardImage: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    height: '100%',
  },
});
