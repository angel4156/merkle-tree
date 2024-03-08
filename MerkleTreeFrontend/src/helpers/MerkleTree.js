import keccak256 from 'keccak256'
const _ff = Buffer.from([
  0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
  0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
  0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
  0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff
]);
class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class MerkleTree {
  constructor(leaves) {
    // root of a binary search tree
    this.root = null;
    this.makeDefaultLeaves(leaves);
    this.makeTree();
  }

  makeDefaultLeaves(leaves) {
    var pre_len = leaves.length;
    var new_len = 1;
    var depth = 0;
    do {
      ++depth;
      new_len *= 2;
    } while (new_len < pre_len);

    leaves = leaves.map(String)
    leaves = leaves.map(keccak256);
    // leaves = leaves.sort(Buffer.compare);
    for (let i = 0; i < (new_len - pre_len); i++) {
      leaves = leaves.concat(_ff);
    }

    this.leaves = leaves;
    this.depth = depth;
    this.nodes = new Array(depth);
  }
  makeTree() {
    this.nodes[0] = new Array;
    for (let i = 0; i < this.leaves.length; ++i) {
      const ele = this.leaves[i];
      this.nodes[0].push(new Node(ele))
    }
    for (let deg = 1; deg <= this.depth; ++deg) {
      this.nodes[deg] = new Array;
      const nodeLength = this.nodes[deg - 1].length / 2
      for (let i = 0; i < nodeLength; ++i) {
        if (this.isZeroHash(this.nodes[deg - 1][i * 2]) && this.isZeroHash(this.nodes[deg - 1][i * 2 + 1])) {
          this.nodes[deg].push(new Node(_ff));
        } else if (this.isZeroHash(this.nodes[deg - 1][i * 2])) {
          this.nodes[deg].push(this.nodes[deg - 1][i * 2 + 1]);
        } else if (this.isZeroHash(this.nodes[deg - 1][i * 2 + 1])) {
          this.nodes[deg].push(this.nodes[deg - 1][i * 2]);
        } else {
          // this.nodes[deg].push([...this.nodes[deg-1][i*2].slice(0, 20), ...this.nodes[deg-1][i*2].slice(0, 20)]);
          let newdata
          if (Buffer.compare(this.nodes[deg - 1][i * 2].data, this.nodes[deg - 1][i * 2 + 1].data) === 1) {
            newdata = Buffer.concat([this.nodes[deg - 1][i * 2 + 1].data, this.nodes[deg - 1][i * 2].data])
          } else {
            newdata = Buffer.concat([this.nodes[deg - 1][i * 2].data, this.nodes[deg - 1][i * 2 + 1].data])
          }
          this.nodes[deg].push(new Node(keccak256(newdata)))
        }
      }
      //this.nodes[deg] = this.nodes[deg].sort((a, b) => Buffer.compare(a.data, b.data));
    }
    this.root = this.nodes[this.depth][0].data
  }
  isZeroHash(node) {
    return node.data.toString('hex') === _ff.toString('hex');
  }
  getHexProof = val => {
    let proofs = []
    let index = this.nodes[0].findIndex(leaf => Buffer.compare(leaf.data, keccak256(val)) === 0)
    if (index < 0) {
      return []
    }
    for (let i = 0; i < this.depth; ++i) {
      const siblingIndex = (index % 2 === 0 ? (index + 1) : (index - 1))
      proofs.push('0x' + this.nodes[i][siblingIndex].data.toString('hex'))
      // proofs.push(this.nodes[i][siblingIndex].data.toString('hex'))
      index = Math.floor(index / 2)
    }
    return proofs
  }
  getProof = val => {
    let proofs = []
    let index = this.nodes[0].findIndex(leaf => Buffer.compare(leaf.data, keccak256(val)) === 0)
    if (index < 0) {
      return []
    }
    for (let i = 0; i < this.depth; ++i) {
      const siblingIndex = (index % 2 === 0 ? (index + 1) : (index - 1))
      proofs.push(this.nodes[i][siblingIndex].data)
      index = Math.floor(index / 2)
    }
    return proofs
  }
  getRoot() {
    return this.nodes[this.depth]
  }
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}
const verify = (val, proof) => {
  let cur = keccak256(val)
  proof.map(proofelement => {
    if (Buffer.compare(proofelement, keccak256('0')) === 0) {
      console.log("zero hash")
    } else if (Buffer.compare(cur, proofelement) == 1) {
      cur = keccak256(Buffer.concat([proofelement, cur]))
    } else {
      cur = keccak256(Buffer.concat([cur, proofelement]))
    }
  })
  return cur
}

// const verify = (val, proof) => {
//   let cur = keccak256(val)
//   proof.map(proofelement => {
//     if (Buffer.compare(proofelement, keccak256('0')) === 0) {
//       console.log("zero hash")
//     } else if (Buffer.compare(cur, proofelement) == 1) {
//       cur = keccak256(Buffer.concat([proofelement, cur]))
//     } else {
//       cur = keccak256(Buffer.concat([cur, proofelement]))
//     }
//   })
//   return cur
// }

export default MerkleTree