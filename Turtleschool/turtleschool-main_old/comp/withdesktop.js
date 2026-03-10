import {UserAgent, UserAgentProvider} from '@quentin-sommer/react-useragent';

const withDesktop = (A, B) => {
  return props => {
    return (
      <UserAgentProvider ua={window.navigator.userAgent}>
        <UserAgent computer>
          <A {...props} />
        </UserAgent>
        <UserAgent mobile>
          <B {...props} />
        </UserAgent>
      </UserAgentProvider>
    );
  };
};

export default withDesktop;
