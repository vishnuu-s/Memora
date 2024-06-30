import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  useColorScheme,
  Appearance,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AltIcon from 'react-native-vector-icons/FontAwesome6';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, Note} from '../App';
import {COLORS} from '../components/theme';
import MyComponent from '../components/AnimatedButton';
import {Menu, PaperProvider} from 'react-native-paper';
import {Dialog} from 'react-native-simple-dialogs';

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
type CardProps = {
  index: number;
  heading: string;
  bodyText: string;
  onDelete: (index: number) => void;
  onEdit: (title: string, data: string, index: number) => void;
  imagePath?: string;
  tags: {text: string; isSelected: boolean}[];
};

const Card: React.FC<CardProps> = ({
  index,
  heading,
  bodyText,
  onDelete,
  onEdit,
  imagePath,
  tags,
}) => {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? 'dark'];
  return (
    <View
      style={[styles.cardBackground, {backgroundColor: colors['tertiary']}]}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onEdit(heading, bodyText, index)}
        activeOpacity={0.7}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={{uri: imagePath}}
            style={{
              width: '100%',
              height: 180,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          />
        </View>
        <View style={{paddingHorizontal: 10}}>
          <Text style={[cardStyle.headingText, {color: colors['primary']}]}>
            {heading.length > 100
              ? heading.substring(0, 17) + '  ...Read more'
              : heading}
          </Text>
          <View style={{flexDirection: 'row'}}>
            {tags.map((tag, index) => {
              return !tag.isSelected ? null : (
                <View key={index} style={cardStyle.tagContainer}>
                  <Text style={cardStyle.tagText}>{tag.text}</Text>
                </View>
              );
            })}
          </View>
          <Text style={[cardStyle.bodyText, {color: colors['primary']}]}>
            {bodyText.length > 100
              ? bodyText.replaceAll('\n', ' ').substring(0, 180) +
                '  ...Read more'
              : bodyText}
          </Text>

          <View style={cardStyle.deleteContainer}>
            <TouchableOpacity onPress={() => onDelete(index)}>
              <Icon style={cardStyle.delete} name="trash" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const Home = ({route: previousRoute, navigation}: HomeProps) => {
  const [notes, setNotes] = useState<Note[]>(previousRoute.params.notes || []);
  const [deleteAlertVisible, setDeleteAlertVisible] = React.useState(false);
  const [indexToBeDeleted, setIndexToBeDeleted] = useState<number>(0);
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? 'dark'];
  const [darkTheme, setDarkTheme] = useState(false);
  const [isExtended, setIsExtended] = useState<boolean>(true);
  /*FOR MENU 
  const [visible, setDeleteAlertVisible] = React.useState(false);
  const openMenu = () => setDeleteAlertVisible(true);
  const closeMenu = () => setDeleteAlertVisible(false);
  */

  useEffect(() => {
    const getNotes = async () => {
      try {
        const value = await AsyncStorage.getItem('notes');
        const parsedNotes = value ? JSON.parse(value) : [];
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Error retrieving notes:', error);
      }
    };
    getNotes();
  }, []);

  const handleDelete = async (index: number) => {
    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    setNotes(updatedNotes);

    try {
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      setDeleteAlertVisible(false);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };
  const handleEdit = (
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

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    darkTheme
      ? Appearance.setColorScheme('dark')
      : Appearance.setColorScheme('light');
  };

  /**
   * <PaperProvider>
            <View>
              <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={openMenu}
                    style={{flexDirection: 'row'}}>
                    <Text style={styles.titleText}>All notes</Text>
                    <Icon
                      name="chevron-down"
                      size={20}
                      color={'black'}
                      style={{
                        textAlignVertical: 'center',
                        paddingLeft: 5,
                      }}></Icon>
                  </TouchableOpacity>
                }
                style={{position: 'absolute', elevation: 10, left: 0, top: 50}}
                anchorPosition="bottom"
                contentStyle={{backgroundColor: 'white'}}>
                <Menu.Item
                  onPress={() => {}}
                  title="Archived"
                  titleStyle={{color: 'black', fontWeight: 'bold'}}
                />
                <Menu.Item
                  onPress={() => {}}
                  title="Recently Deleted"
                  titleStyle={{color: 'black', fontWeight: 'bold'}}
                />
                <Menu.Item
                  onPress={() => {}}
                  title="Important"
                  titleStyle={{color: 'black', fontWeight: 'bold'}}
                />
              </Menu>
            </View>
          </PaperProvider>
   */

  return (
    <SafeAreaView style={styles.background}>
      <StatusBar
        backgroundColor={colors['secondary']}
        barStyle={darkTheme ? 'light-content' : 'dark-content'}
      />
      <ScrollView
        onScroll={event => {
          const currentScrollPosition =
            Math.floor(event.nativeEvent.contentOffset.y) ?? 0;
          setIsExtended(currentScrollPosition <= 0);
        }}
        style={[styles.base, {backgroundColor: colors['secondary']}]}>
        <View style={styles.homeNavigationContainer}>
          <TouchableOpacity onPress={toggleTheme}>
            <AltIcon
              name={darkTheme ? 'sun' : 'moon'}
              size={25}
              color={colors['primary']}
              solid
            />
          </TouchableOpacity>
          <Text style={[styles.titleText, {color: colors['primary']}]}>
            All notes
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Search', {notes: notes})}>
            <Icon name="search" size={20} color={colors['primary']} />
          </TouchableOpacity>
        </View>
        <Dialog
          visible={deleteAlertVisible}
          title="Delete Note"
          onTouchOutside={() => setDeleteAlertVisible(false)}
          onRequestClose={() => setDeleteAlertVisible(false)}
          contentInsetAdjustmentBehavior="never"
          animationType="fade"
          statusBarTranslucent
          titleStyle={{fontFamily: 'Raleway-Bold'}}>
          <View>
            <Text style={{fontFamily: 'Mulish-Light', fontSize: 15}}>
              Are you sure you want to delete this note?
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'center',
                marginTop: 15,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setDeleteAlertVisible(false);
                }}
                activeOpacity={0.8}
                style={{
                  backgroundColor: '#1F2421',
                  padding: 10,
                  borderRadius: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Icon
                  name="times"
                  color={'white'}
                  size={15}
                  style={{marginHorizontal: 5}}
                />
                <Text style={{color: '#FFF'}}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setDeleteAlertVisible(false);
                  handleDelete(indexToBeDeleted);
                }}
                activeOpacity={0.8}
                style={{
                  backgroundColor: '#1F2421',
                  padding: 10,
                  borderRadius: 10,
                  marginLeft: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Icon
                  name="trash-alt"
                  color={'#ff8080'}
                  size={15}
                  style={{marginHorizontal: 5}}
                />
                <Text style={{color: '#FFF'}}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Dialog>
        {notes.map((item, index) => (
          <Card
            key={index}
            index={index}
            heading={item.title}
            bodyText={item.data}
            onDelete={() => {
              setDeleteAlertVisible(true);
              setIndexToBeDeleted(index);
            }}
            onEdit={() =>
              handleEdit(item.title, item.data, index, item.image, item.tags)
            }
            imagePath={item.image}
            tags={item.tags === undefined ? [] : item.tags}
          />
        ))}
      </ScrollView>
      <View style={styles.fixedElement}>
        <MyComponent
          icon="plus"
          label="Add Note"
          onPress={() => navigation.navigate('NewNote', {notes: notes})}
          visible={true}
          extended={isExtended}
          animateFrom="right"
          iconMode="dynamic"
          style={styles.fixedElement}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#1F2421',
    height: '100%',
    width: '100%',
  },

  base: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  homeNavigationContainer: {
    margin: 5,
    paddingTop: 7,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },

  titleText: {
    fontFamily: 'Raleway-Bold',
    fontSize: 27,
    color: 'black',
    textAlign: 'left',
    paddingHorizontal: 5,
  },

  cardBackground: {
    margin: 15,
    backgroundColor: 'white',
    elevation: 8,
    shadowOffset: {width: 7, height: 7},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    borderRadius: 10,
  },

  card: {
    paddingBottom: 10,
  },

  fixedElement: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#216869',
  },

  addNote: {
    borderRadius: 50,
    width: 60,
    height: 60,
    backgroundColor: '#216869',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const cardStyle = StyleSheet.create({
  noteImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  headingText: {
    fontFamily: 'Figtree-Bold',
    fontSize: 25,
    color: '#1F2421',
    textAlign: 'left',
    padding: 5,
    paddingTop: 10,
  },

  tagContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginHorizontal: 2,
    borderRadius: 10,
    backgroundColor: '#ffcd00',
  },

  tagText: {
    fontSize: 10,
    color: 'white',
  },

  bodyText: {
    fontFamily: 'Mulish-Light',
    fontSize: 13,
    color: '#1F2421',
    textAlign: 'left',
    padding: 5,
  },

  menu: {
    color: 'black',
    fontSize: 20,
    width: '100%',
    height: 'auto',
    position: 'absolute',
    top: 15,
    right: 10,
  },

  menuContainer: {
    position: 'absolute',
    top: 15,
    right: 10,
    height: '100%',
  },

  deleteContainer: {
    position: 'absolute',
    top: 15,
    right: 10,
  },

  delete: {
    color: '#FF3F3F',
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },

  edit: {
    color: 'black',
    fontSize: 23,
  },
});
