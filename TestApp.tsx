import { Button } from 'design-toolkit/components/src/components/button';
import { Chip } from 'design-toolkit/components/src/components/chip';
import { TextField } from 'design-toolkit/components/src/components/text-field';
import React from 'react';

export default function App() {
  const [value, setValue] = React.useState('');
  const [chips, setChips] = React.useState(['React', 'TypeScript', 'UI']);

  return (
    <div style={{ padding: 32, fontFamily: 'sans-serif', maxWidth: 400 }}>
      <h2>Test App</h2>
      <TextField
        label='Your Name'
        value={value}
        onChange={setValue}
        inputProps={{ placeholder: 'Enter your name' }}
        style={{ marginBottom: 16 }}
      />
      <Button
        variant='filled'
        size='medium'
        style={{ marginBottom: 16 }}
        onPress={() => alert(`Hello, ${value || 'World'}!`)}
      >
        Greet
      </Button>
      <div style={{ marginTop: 24 }}>
        <h4>Chips</h4>
        <Chip.List>
          {chips.map((chip) => (
            <Chip key={chip} style={{ marginRight: 8 }}>
              {chip}
            </Chip>
          ))}
        </Chip.List>
      </div>
    </div>
  );
}
