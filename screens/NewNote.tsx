import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {RootStackParamList, Note} from '../App';
import {StackActions, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {HelperText} from 'react-native-paper';
import Modal from 'react-native-modal';
import {Dialog} from 'react-native-simple-dialogs';
import {COLORS} from '../components/theme';

type NewNoteProps = NativeStackScreenProps<RootStackParamList, 'NewNote'>;

const NewNote = ({route}: NewNoteProps) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'NewNote'>>();
  const [notes, setNotes] = useState<Note[]>(route.params.notes);
  const [imagePath, setImagePath] = useState(
    'https://static.vecteezy.com/system/resources/thumbnails/038/987/289/small_2x/ai-generated-majestic-mountain-peak-reflects-tranquil-sunset-over-water-generated-by-ai-photo.jpg',
  );
  const [tags, setTags] = useState([
    {text: 'Work', isSelected: false},
    {text: 'Life', isSelected: false},
    {text: 'Urgent', isSelected: false},
  ]);
  const [hasImageBeenSet, setHasImageBeenSet] = useState(false);
  const [customTagName, setCustomTagName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [titleHasErrors, setTitleHasErrors] = useState(false);
  const [bodyHasErrors, setBodyHasErrors] = useState(false);
  const [saveAlertVisible, setSaveAlertVisible] = React.useState(false);
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? 'dark'];

  const selectImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: false,
    }).then(image => {
      setImagePath(image.path);
      setHasImageBeenSet(true);
    });
  };

  const handleTagPress = (index: number) => {
    const updatedTags = [...tags];
    updatedTags[index].isSelected = !updatedTags[index].isSelected;
    setTags(updatedTags);
  };

  const handleSave = async () => {
    if (title == '' || body == '') {
      Alert.alert('Error', 'Title and body fields cannot be empty', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
      return;
    } else {
      const newNote: Note = {title, data: body, image: imagePath, tags: tags};
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);

      try {
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      } catch (error) {
        console.error('Error saving notes:', error);
      }

      navigation.dispatch(StackActions.replace('Home', {notes: updatedNotes}));
    }
  };

  const addCustomTag = () => {
    const updatedTags = [...tags];
    updatedTags.push({text: customTagName, isSelected: false});
    setTags(updatedTags);
    setCustomTagName('');
    setModalVisible(false);
  };

  const deleteTag = (index: number) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
  };

  return (
    <View
      style={[styles.newNotecontainer, {backgroundColor: colors['secondary']}]}>
      <ScrollView>
        <View style={styles.newNoteNavigationContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{width: '25%'}}>
            <Icon
              name="arrow-left"
              size={20}
              color={colors['primary']}
              style={{textAlign: 'left'}}
            />
          </TouchableOpacity>

          <Text style={[styles.titleText, {color: colors['primary']}]}>
            New note
          </Text>

          <Dialog
            visible={saveAlertVisible}
            title="Save Note"
            onTouchOutside={() => setSaveAlertVisible(false)}
            onRequestClose={() => setSaveAlertVisible(false)}
            contentInsetAdjustmentBehavior="never"
            animationType="fade"
            statusBarTranslucent
            titleStyle={{fontFamily: 'Raleway-Bold'}}>
            <View>
              <Text style={{fontFamily: 'Mulish-Light', fontSize: 15}}>
                Are you sure you want to save this note?
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
                    setSaveAlertVisible(false);
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
                    style={{marginRight: 7}}
                  />
                  <Text style={{color: '#FFF'}}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSaveAlertVisible(false);
                    handleSave();
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
                    name="save"
                    color={'green'}
                    size={15}
                    style={{marginRight: 7}}
                  />
                  <Text style={{color: '#FFF'}}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Dialog>

          <TouchableOpacity
            style={{width: '25%'}}
            onPress={() => setSaveAlertVisible(true)}>
            <Text style={[styles.saveText, {color: colors['primary']}]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.titleInput,
              {color: colors['primary'], borderColor: colors['primary']},
            ]}
            placeholder="Title"
            placeholderTextColor={colors['primary']}
            value={title}
            onChangeText={setTitle}
            onSelectionChange={
              title == ''
                ? () => setTitleHasErrors(true)
                : () => setTitleHasErrors(false)
            }
            spellCheck={true}
            textAlign="left"
          />
          <HelperText
            type="error"
            visible={titleHasErrors}
            style={styles.helperText}>
            Title cannot be empty
          </HelperText>

          <TextInput
            style={[
              styles.noteInput,
              {backgroundColor: colors['tertiary'], color: colors['primary']},
            ]}
            placeholder="Start writing your note..."
            placeholderTextColor={colors['primary']}
            value={body}
            onChangeText={setBody}
            onSelectionChange={
              body == ''
                ? () => setBodyHasErrors(true)
                : () => setBodyHasErrors(false)
            }
            multiline
          />
          <HelperText
            type="error"
            visible={bodyHasErrors}
            style={styles.helperText}>
            Body cannot be empty
          </HelperText>

          <Modal
            isVisible={modalVisible}
            onBackdropPress={() => setModalVisible(false)}
            onSwipeComplete={() => setModalVisible(false)}
            animationIn={'fadeIn'}
            animationOut={'fadeOut'}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors['secondary'],
                height: 200,
                borderRadius: 7,
                padding: 15,
              }}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 15,
                  width: 'auto',
                  height: 'auto',
                }}>
                <Icon
                  name="times"
                  size={20}
                  color={colors['primary']}
                  style={{textAlign: 'right'}}
                />
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: 10,
                  color: colors['primary'],
                }}>
                Add custom tag
              </Text>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  placeholder={'Enter custom name'}
                  placeholderTextColor={colors['primary']}
                  value={customTagName}
                  onChangeText={setCustomTagName}
                  style={{
                    width: '85%',
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    borderColor: 'gray',
                    borderWidth: 0.7,
                    padding: 5,
                    margin: 0,
                    color: colors['primary'],
                  }}
                  autoFocus
                />
                <TouchableOpacity
                  onPress={addCustomTag}
                  style={{
                    width: '15%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: 'gray',
                    borderWidth: 0.7,
                    padding: 10,
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    margin: 0,
                  }}>
                  <Icon name="save" size={25} color={colors['primary']}></Icon>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Text style={[styles.tagTitle, {color: colors['primary']}]}>
            Tagging
          </Text>
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tag,
                  {backgroundColor: colors['secondary']},
                  tag.isSelected && {
                    backgroundColor: '#58D68D',
                    borderColor: 'white',
                    borderWidth: 0,
                  },
                ]}
                onPress={() => handleTagPress(index)}
                onLongPress={() => deleteTag(index)}>
                <Text style={[styles.tagText, {color: colors['primary']}]}>
                  {tag.text}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{
                backgroundColor: 'black',
                borderRadius: 100,
                paddingHorizontal: 15,
                paddingVertical: 5,
                marginRight: 10,
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 15,
                  fontWeight: 'bold',
                }}>
                +
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.tagTitle, , {color: colors['primary']}]}>
            Banner
          </Text>

          {hasImageBeenSet ? (
            <View style={styles.imagePreviewContainerImage}>
              <Image source={{uri: imagePath}} style={styles.imagePreview} />
              <TouchableOpacity
                style={{
                  backgroundColor: 'black',
                  borderRadius: 8,
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  marginRight: 10,
                  width: '50%',
                }}
                onPress={() => setHasImageBeenSet(false)}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}>
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => selectImage()}>
              <View style={styles.imagePreviewContainer}>
                <Text style={{margin: 10, color: '#999999'}}>
                  No banner image has been added. To add an image, click here
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default NewNote;

const styles = StyleSheet.create({
  newNotecontainer: {
    flex: 1,
    backgroundColor: 'white',
  },

  newNoteNavigationContainer: {
    margin: 5,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  helperText: {
    margin: 0,
    padding: 0,
    marginBottom: 7,
  },

  titleText: {
    fontSize: 23,
    fontFamily: 'Raleway-Bold',
    color: '#1F2421',
    textAlign: 'center',
    width: '50%',
  },

  titleInput: {
    fontFamily: 'Mulish-Light',
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    color: '#1F2421',
  },

  formatButtonContainer: {
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 7,
    marginRight: 10,
  },

  saveText: {
    fontSize: 15,
    fontFamily: 'Raleway-Bold',
    color: '#1F2421',
    textAlign: 'right',
  },

  noteInput: {
    fontFamily: 'Mulish-Light',
    textAlignVertical: 'top',
    height: 'auto',
    maxHeight: '50%',
    borderRadius: 10,
    padding: 20,
    color: '#1F2421',
  },

  inputContainer: {
    paddingHorizontal: 10,
    paddingVertical: 16,
  },

  fixedElement: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },

  tagTitle: {
    fontSize: 22,
    fontFamily: 'Figtree-Bold',
    color: '#1F2421',
    textAlign: 'left',
  },

  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    paddingBottom: 10,
  },

  tag: {
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 100,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 10,
  },

  tagText: {
    fontFamily: 'Mulish-Light',
    fontSize: 12,
  },

  imagePreviewContainer: {
    height: 200,
    width: '100%',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
  },

  imagePreviewContainerImage: {
    height: 'auto',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },

  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 10,
  },
});
