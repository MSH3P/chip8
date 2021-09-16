class CHIP8 {
  // about 4kb of RAM, 0x000->0xfff.
  // the first 512 bytes 0x000 -> 0x1ff is where font is loaded
  // and originally the interpreter, not to be used by programs.
  memory: number[] = new Array(4096);
  // 16 general purpose registers, VF is used as a flag by some instructions.
  registers: number[] = new Array(16);
  //points to topmost level of stack.
  stack: number[] = new Array(16);
  //currently executing adress location
  pc: number = 0x200;
  //used to store memory addresses.,
  I: number = 0;
  // Delay and Sound timers.
  delay: number = 0;
  sound: number = 0;

  cycle() {
    let opcode: number = (this.memory[this.pc] << 8) | this.memory[this.pc + 1];
  }

  executeInstruction(opcode: number) {
    let x: number = (opcode & 0xf00) >> 8;
    let y: number = (opcode & 0x00f0) >> 4;

    switch (opcode & 0xf00) {
      case 0x0000:
        switch (opcode) {
          case 0x00e0:
            // clear display
            break;
          case 0x00ee:
            this.pc = Number(this.stack.pop());
            break;
        }
        break;
      case 0x1000:
        this.pc = opcode & 0xfff;
        break;
      case 0x2000:
        this.stack.push(this.pc);
        this.pc = opcode & 0xfff;
        break;
      case 0x3000:
        if (this.registers[x] == (opcode & 0xff)) this.pc += 2;
        break;
      case 0x4000:
        if (this.registers[x] != (opcode & 0xff)) this.pc += 2;
        break;
      case 0x5000:
        if (this.registers[x] == this.registers[y]) this.pc += 2;
        break;
      case 0x6000:
        this.registers[x] = opcode & 0xff;
        break;
      case 0x7000:
        this.registers[x] += opcode & 0xff;
        break;
      case 0x8000:
        switch (opcode & 0xf) {
          case 0x0:
            this.registers[x] = this.registers[y];
            break;
          case 0x1:
            this.registers[x] |= this.registers[y];
            break;
          case 0x2:
            this.registers[x] &= this.registers[y];
            break;
          case 0x3:
            this.registers[x] ^= this.registers[y];
          case 0x4:
            let sum = this.registers[x] + this.registers[y];
            this.registers[0xf] = sum > 0xff ? 1 : 0;
            this.registers[x] = sum & 0xff;
            break;
          case 0x5:
            this.registers[0xf] = this.registers[x] > this.registers[y] ? 1 : 0;
            this.registers[x] -= this.registers[y];
          case 0x6:
            this.registers[0xf] = this.registers[x] & 0x1;
            this.registers[x] >>= 1;
            break;
          case 0x7:
            this.registers[0xf] = this.registers[y] > this.registers[x] ? 1 : 0;
            this.registers[x] = this.registers[y] - this.registers[x];
            break;
          case 0xe:
            this.registers[0xf] = this.registers[x] & 0x80;
            this.registers[x] <<= 1;
            break;
        }
        break;
      case 0x9000:
        if (this.registers[x] != this.registers[y]) this.pc += 2;
        break;
      case 0xa000:
        this.I = opcode & 0xfff;
        break;
      case 0xb000:
        this.pc = (opcode & 0xfff) + this.registers[0];
        break;
      case 0xc000:
        let rand = Math.floor(Math.random() * 0x100);
        this.registers[x] = rand & (opcode & 0xff);
        break;
      case 0xd000:
        break;
      case 0xe000:
        break;
      case 0xf000:
        switch (opcode) {
          case 0x07:
            this.registers[x] = 0;
            break;
          case 0x0a:
            break;
          case 0x15:
            break;
          case 0x18:
            break;
          case 0x1e:
        }
        break;
    }
  }
}
