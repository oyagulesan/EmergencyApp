import React from 'react';
import { Button } from 'react-native-elements';

const RoundButton = (props) => {
    return (
      <Button
        disabled={props.disabled}
        title={props.title}
        onPress={props.onPress}
        buttonStyle={{
          margin: 10,
          paddingVertical: 0,
          borderRadius: 30,
          height: 25,
          width: 100,
          alignSelf: 'center',
          ...props.style
        }}
        icon={props.icon}
      >
        {props.children}
      </Button>
    );
  }
  export default RoundButton;
