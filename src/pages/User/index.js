import React, {Component} from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Avatar,
  Header,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  LoadingIndicator,
} from './styles';
import {ActivityIndicator} from 'react-native';

export default class User extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('user').name,
  });

  constructor(props) {
    super(props);
    this.state = {
      stars: [],
      loading: false,
      pageIndex: 1,
    };
  }

  async componentDidMount() {
    const {navigation} = this.props;
    const user = navigation.getParam('user');
    this.setState({loading: true});
    const response = await api.get(`/users/${user.login}/starred`);
    this.setState({stars: response.data, loading: false});
  }

  async loadMore() {
    const {navigation} = this.props;
    const user = navigation.getParam('user');
    const {pageIndex} = this.state;

    const nextPage = pageIndex + 1;

    const response = await api.get(
      `/users/${user.login}/starred?page=${nextPage}`
    );

    this.setState({stars: response.data, pageIndex: nextPage});
  }

  render() {
    const {navigation} = this.props;
    const {stars, loading} = this.state;

    const user = navigation.getParam('user');

    return (
      <Container loading={loading}>
        <Header>
          <Avatar source={{uri: user.avatar}} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <LoadingIndicator color="#333" />
        ) : (
          <Stars
            onEndReachedThreshold={0.2}
            onEndReadched={this.loadMore}
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({item}) => (
              <Starred>
                <OwnerAvatar source={{uri: item.owner.avatar_url}} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
