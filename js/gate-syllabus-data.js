// ============================================================
// GATE CS/IT — Complete Syllabus Data
// Source: GATE 2026/2027 Official Syllabus (IIT standard)
// ============================================================

const GATE_SYLLABUS = [
  {
    id: 'general-aptitude',
    name: 'General Aptitude',
    topics: [
      {
        id: 'verbal-aptitude',
        name: 'Verbal Aptitude',
        subtopics: [
          { id: 'va-grammar', name: 'English Grammar', status: 'not_started' },
          { id: 'va-vocabulary', name: 'Vocabulary', status: 'not_started' },
          { id: 'va-reading', name: 'Reading Comprehension', status: 'not_started' },
          { id: 'va-word-groups', name: 'Word Groups & Analogies', status: 'not_started' },
          { id: 'va-sentence-completion', name: 'Sentence Completion', status: 'not_started' },
        ]
      },
      {
        id: 'quantitative-aptitude',
        name: 'Quantitative Aptitude',
        subtopics: [
          { id: 'qa-data-interpretation', name: 'Data Interpretation', status: 'not_started' },
          { id: 'qa-numerical-computation', name: 'Numerical Computation', status: 'not_started' },
          { id: 'qa-mensuration', name: 'Mensuration & Geometry', status: 'not_started' },
          { id: 'qa-statistics', name: 'Elementary Statistics & Probability', status: 'not_started' },
        ]
      },
      {
        id: 'analytical-aptitude',
        name: 'Analytical Aptitude',
        subtopics: [
          { id: 'aa-logic', name: 'Logical Reasoning', status: 'not_started' },
          { id: 'aa-patterns', name: 'Pattern Recognition', status: 'not_started' },
          { id: 'aa-syllogisms', name: 'Syllogisms & Conclusions', status: 'not_started' },
        ]
      }
    ]
  },
  {
    id: 'discrete-mathematics',
    name: 'Discrete Mathematics',
    topics: [
      {
        id: 'propositional-logic',
        name: 'Propositional & First Order Logic',
        subtopics: [
          { id: 'pl-propositions', name: 'Propositions & Connectives', status: 'not_started' },
          { id: 'pl-truth-tables', name: 'Truth Tables & Tautologies', status: 'not_started' },
          { id: 'pl-equivalence', name: 'Logical Equivalences', status: 'not_started' },
          { id: 'pl-predicates', name: 'Predicates & Quantifiers', status: 'not_started' },
          { id: 'pl-inference', name: 'Rules of Inference', status: 'not_started' },
        ]
      },
      {
        id: 'sets-relations',
        name: 'Sets, Relations & Functions',
        subtopics: [
          { id: 'sr-sets', name: 'Sets & Set Operations', status: 'not_started' },
          { id: 'sr-relations', name: 'Relations & Properties', status: 'not_started' },
          { id: 'sr-equivalence', name: 'Equivalence Relations & Partitions', status: 'not_started' },
          { id: 'sr-partial-orders', name: 'Partial Orders & Lattices', status: 'not_started' },
          { id: 'sr-functions', name: 'Functions (Injective, Surjective, Bijective)', status: 'not_started' },
        ]
      },
      {
        id: 'combinatorics',
        name: 'Combinatorics',
        subtopics: [
          { id: 'comb-counting', name: 'Counting Principles', status: 'not_started' },
          { id: 'comb-pigeonhole', name: 'Pigeonhole Principle', status: 'not_started' },
          { id: 'comb-recurrence', name: 'Recurrence Relations', status: 'not_started' },
          { id: 'comb-generating', name: 'Generating Functions', status: 'not_started' },
        ]
      },
      {
        id: 'graph-theory',
        name: 'Graph Theory',
        subtopics: [
          { id: 'gt-basics', name: 'Graph Basics & Representations', status: 'not_started' },
          { id: 'gt-connectivity', name: 'Connectivity & Components', status: 'not_started' },
          { id: 'gt-matching', name: 'Matching', status: 'not_started' },
          { id: 'gt-coloring', name: 'Graph Coloring', status: 'not_started' },
          { id: 'gt-trees', name: 'Trees & Spanning Trees', status: 'not_started' },
          { id: 'gt-planarity', name: 'Planarity & Euler\'s Formula', status: 'not_started' },
        ]
      },
      {
        id: 'algebra-groups',
        name: 'Groups & Monoids',
        subtopics: [
          { id: 'ag-monoids', name: 'Monoids & Semigroups', status: 'not_started' },
          { id: 'ag-groups', name: 'Groups & Subgroups', status: 'not_started' },
          { id: 'ag-homomorphisms', name: 'Homomorphisms', status: 'not_started' },
        ]
      }
    ]
  },
  {
    id: 'linear-algebra',
    name: 'Linear Algebra',
    topics: [
      {
        id: 'matrices',
        name: 'Matrices & Determinants',
        subtopics: [
          { id: 'la-matrices', name: 'Matrix Operations & Types', status: 'not_started' },
          { id: 'la-determinants', name: 'Determinants & Properties', status: 'not_started' },
          { id: 'la-inverse', name: 'Matrix Inverse', status: 'not_started' },
          { id: 'la-rank', name: 'Rank of Matrix', status: 'not_started' },
        ]
      },
      {
        id: 'linear-equations',
        name: 'System of Linear Equations',
        subtopics: [
          { id: 'le-consistency', name: 'Consistency & Solutions', status: 'not_started' },
          { id: 'le-lu', name: 'LU Decomposition', status: 'not_started' },
        ]
      },
      {
        id: 'eigenvalues',
        name: 'Eigenvalues & Eigenvectors',
        subtopics: [
          { id: 'ev-computation', name: 'Finding Eigenvalues', status: 'not_started' },
          { id: 'ev-properties', name: 'Properties & Diagonalization', status: 'not_started' },
        ]
      }
    ]
  },
  {
    id: 'calculus',
    name: 'Calculus',
    topics: [
      {
        id: 'limits-continuity',
        name: 'Limits, Continuity & Differentiability',
        subtopics: [
          { id: 'calc-limits', name: 'Limits & Continuity', status: 'not_started' },
          { id: 'calc-diff', name: 'Differentiability & Derivatives', status: 'not_started' },
          { id: 'calc-mvt', name: 'Mean Value Theorem', status: 'not_started' },
          { id: 'calc-maxmin', name: 'Maxima & Minima', status: 'not_started' },
        ]
      },
      {
        id: 'integration',
        name: 'Integration',
        subtopics: [
          { id: 'int-definite', name: 'Definite Integrals', status: 'not_started' },
          { id: 'int-indefinite', name: 'Indefinite Integrals', status: 'not_started' },
        ]
      }
    ]
  },
  {
    id: 'probability-statistics',
    name: 'Probability & Statistics',
    topics: [
      {
        id: 'probability',
        name: 'Probability',
        subtopics: [
          { id: 'prob-basics', name: 'Sample Space & Events', status: 'not_started' },
          { id: 'prob-conditional', name: 'Conditional Probability', status: 'not_started' },
          { id: 'prob-bayes', name: 'Bayes\' Theorem', status: 'not_started' },
          { id: 'prob-random-var', name: 'Random Variables', status: 'not_started' },
        ]
      },
      {
        id: 'distributions',
        name: 'Distributions',
        subtopics: [
          { id: 'dist-uniform', name: 'Uniform Distribution', status: 'not_started' },
          { id: 'dist-binomial', name: 'Binomial Distribution', status: 'not_started' },
          { id: 'dist-poisson', name: 'Poisson Distribution', status: 'not_started' },
          { id: 'dist-normal', name: 'Normal Distribution', status: 'not_started' },
          { id: 'dist-exponential', name: 'Exponential Distribution', status: 'not_started' },
        ]
      },
      {
        id: 'statistics',
        name: 'Statistics',
        subtopics: [
          { id: 'stat-measures', name: 'Mean, Median, Mode', status: 'not_started' },
          { id: 'stat-deviation', name: 'Standard Deviation', status: 'not_started' },
        ]
      }
    ]
  },
  {
    id: 'digital-logic',
    name: 'Digital Logic',
    topics: [
      {
        id: 'boolean-algebra',
        name: 'Boolean Algebra',
        subtopics: [
          { id: 'ba-basics', name: 'Boolean Functions & Gates', status: 'not_started' },
          { id: 'ba-minimization', name: 'Minimization (K-Maps, QM)', status: 'not_started' },
        ]
      },
      {
        id: 'combinational-circuits',
        name: 'Combinational Circuits',
        subtopics: [
          { id: 'cc-mux-demux', name: 'Multiplexers & Demultiplexers', status: 'not_started' },
          { id: 'cc-encoders', name: 'Encoders & Decoders', status: 'not_started' },
          { id: 'cc-adders', name: 'Adders & Subtractors', status: 'not_started' },
        ]
      },
      {
        id: 'sequential-circuits',
        name: 'Sequential Circuits',
        subtopics: [
          { id: 'sc-flipflops', name: 'Flip-Flops (SR, D, JK, T)', status: 'not_started' },
          { id: 'sc-counters', name: 'Counters & Registers', status: 'not_started' },
          { id: 'sc-fsm', name: 'Finite State Machines', status: 'not_started' },
        ]
      },
      {
        id: 'number-representation',
        name: 'Number Representation',
        subtopics: [
          { id: 'nr-fixed', name: 'Fixed Point Representation', status: 'not_started' },
          { id: 'nr-floating', name: 'Floating Point (IEEE 754)', status: 'not_started' },
        ]
      }
    ]
  },
  {
    id: 'computer-organization',
    name: 'Computer Organization & Architecture',
    topics: [
      {
        id: 'machine-instructions',
        name: 'Machine Instructions & Addressing Modes',
        subtopics: [
          { id: 'mi-types', name: 'Instruction Types & Formats', status: 'not_started' },
          { id: 'mi-addressing', name: 'Addressing Modes', status: 'not_started' },
        ]
      },
      {
        id: 'processor',
        name: 'ALU, Data-path & Control Unit',
        subtopics: [
          { id: 'proc-alu', name: 'ALU Design', status: 'not_started' },
          { id: 'proc-datapath', name: 'Data-path & Control Unit', status: 'not_started' },
        ]
      },
      {
        id: 'pipelining',
        name: 'Instruction Pipelining',
        subtopics: [
          { id: 'pipe-basics', name: 'Pipeline Stages & Throughput', status: 'not_started' },
          { id: 'pipe-hazards', name: 'Pipeline Hazards & Solutions', status: 'not_started' },
        ]
      },
      {
        id: 'memory-hierarchy',
        name: 'Memory Hierarchy',
        subtopics: [
          { id: 'mem-cache', name: 'Cache Memory (Mapping, Replacement)', status: 'not_started' },
          { id: 'mem-main', name: 'Main Memory Organization', status: 'not_started' },
          { id: 'mem-secondary', name: 'Secondary Storage', status: 'not_started' },
        ]
      },
      {
        id: 'io-interface',
        name: 'I/O Interface',
        subtopics: [
          { id: 'io-interrupt', name: 'Interrupt-driven I/O', status: 'not_started' },
          { id: 'io-dma', name: 'DMA (Direct Memory Access)', status: 'not_started' },
        ]
      }
    ]
  },
  {
    id: 'programming-ds',
    name: 'Programming & Data Structures',
    topics: [
      {
        id: 'c-programming',
        name: 'Programming in C',
        subtopics: [
          { id: 'c-basics', name: 'Variables, Data Types, Operators', status: 'not_started' },
          { id: 'c-control', name: 'Control Flow (if, for, while, switch)', status: 'not_started' },
          { id: 'c-functions', name: 'Functions & Recursion', status: 'not_started' },
          { id: 'c-pointers', name: 'Pointers & Dynamic Memory', status: 'not_started' },
          { id: 'c-structs', name: 'Structures & Unions', status: 'not_started' },
          { id: 'c-fileio', name: 'File I/O', status: 'not_started' },
        ]
      },
      {
        id: 'data-structures',
        name: 'Data Structures',
        subtopics: [
          { id: 'ds-arrays', name: 'Arrays & Strings', status: 'not_started' },
          { id: 'ds-stacks', name: 'Stacks', status: 'not_started' },
          { id: 'ds-queues', name: 'Queues (Linear, Circular, Priority)', status: 'not_started' },
          { id: 'ds-linkedlists', name: 'Linked Lists (Singly, Doubly, Circular)', status: 'not_started' },
          { id: 'ds-trees', name: 'Trees (Binary, BST, AVL)', status: 'not_started' },
          { id: 'ds-heaps', name: 'Binary Heaps', status: 'not_started' },
          { id: 'ds-graphs', name: 'Graph Representations', status: 'not_started' },
          { id: 'ds-hashing', name: 'Hashing & Hash Tables', status: 'not_started' },
        ]
      }
    ]
  },
  {
    id: 'algorithms',
    name: 'Algorithms',
    topics: [
      {
        id: 'algo-analysis',
        name: 'Algorithm Analysis',
        subtopics: [
          { id: 'aa-complexity', name: 'Time & Space Complexity', status: 'not_started' },
          { id: 'aa-asymptotic', name: 'Asymptotic Notations (O, Ω, Θ)', status: 'not_started' },
          { id: 'aa-recurrences', name: 'Solving Recurrences (Master Theorem)', status: 'not_started' },
        ]
      },
      {
        id: 'algo-design',
        name: 'Algorithm Design Techniques',
        subtopics: [
          { id: 'ad-divide-conquer', name: 'Divide & Conquer', status: 'not_started' },
          { id: 'ad-greedy', name: 'Greedy Algorithms', status: 'not_started' },
          { id: 'ad-dp', name: 'Dynamic Programming', status: 'not_started' },
          { id: 'ad-backtracking', name: 'Backtracking', status: 'not_started' },
        ]
      },
      {
        id: 'algo-sorting',
        name: 'Searching & Sorting',
        subtopics: [
          { id: 'ss-sorting', name: 'Sorting Algorithms (Merge, Quick, Heap, etc.)', status: 'not_started' },
          { id: 'ss-searching', name: 'Searching (Binary Search, etc.)', status: 'not_started' },
        ]
      },
      {
        id: 'algo-graph',
        name: 'Graph Algorithms',
        subtopics: [
          { id: 'ga-traversals', name: 'BFS & DFS', status: 'not_started' },
          { id: 'ga-mst', name: 'Minimum Spanning Trees (Prim, Kruskal)', status: 'not_started' },
          { id: 'ga-shortest', name: 'Shortest Path (Dijkstra, Bellman-Ford, Floyd-Warshall)', status: 'not_started' },
        ]
      }
    ]
  },
  {
    id: 'theory-of-computation',
    name: 'Theory of Computation',
    topics: [
      {
        id: 'toc-automata',
        name: 'Finite Automata & Regular Languages',
        subtopics: [
          { id: 'fa-dfa', name: 'DFA & NFA', status: 'not_started' },
          { id: 'fa-regex', name: 'Regular Expressions', status: 'not_started' },
          { id: 'fa-pumping', name: 'Pumping Lemma (Regular)', status: 'not_started' },
          { id: 'fa-minimization', name: 'DFA Minimization', status: 'not_started' },
        ]
      },
      {
        id: 'toc-cfg',
        name: 'Context-Free Languages',
        subtopics: [
          { id: 'cfg-grammars', name: 'Context-Free Grammars', status: 'not_started' },
          { id: 'cfg-pda', name: 'Push-Down Automata', status: 'not_started' },
          { id: 'cfg-pumping', name: 'Pumping Lemma (CFG)', status: 'not_started' },
          { id: 'cfg-cnf', name: 'CNF & CYK Parsing', status: 'not_started' },
        ]
      },
      {
        id: 'toc-turing',
        name: 'Turing Machines & Undecidability',
        subtopics: [
          { id: 'tm-basics', name: 'Turing Machine Basics', status: 'not_started' },
          { id: 'tm-undecidability', name: 'Undecidability & Halting Problem', status: 'not_started' },
          { id: 'tm-reducibility', name: 'Reducibility', status: 'not_started' },
        ]
      }
    ]
  },
  {
    id: 'compiler-design',
    name: 'Compiler Design',
    topics: [
      {
        id: 'cd-lexical',
        name: 'Lexical Analysis',
        subtopics: [
          { id: 'lex-tokens', name: 'Tokens, Patterns, Lexemes', status: 'not_started' },
          { id: 'lex-nfa-dfa', name: 'RE to NFA to DFA', status: 'not_started' },
        ]
      },
      {
        id: 'cd-parsing',
        name: 'Parsing',
        subtopics: [
          { id: 'parse-topdown', name: 'Top-Down Parsing (LL)', status: 'not_started' },
          { id: 'parse-bottomup', name: 'Bottom-Up Parsing (LR, SLR, LALR)', status: 'not_started' },
        ]
      },
      {
        id: 'cd-sdt',
        name: 'Syntax-Directed Translation',
        subtopics: [
          { id: 'sdt-definitions', name: 'SDT & Attribute Grammars', status: 'not_started' },
        ]
      },
      {
        id: 'cd-intermediate',
        name: 'Intermediate Code & Optimization',
        subtopics: [
          { id: 'ic-generation', name: 'Intermediate Code (TAC, AST)', status: 'not_started' },
          { id: 'ic-runtime', name: 'Runtime Environments', status: 'not_started' },
          { id: 'ic-optimization', name: 'Local Optimization & Data Flow Analysis', status: 'not_started' },
        ]
      }
    ]
  },
  {
    id: 'operating-systems',
    name: 'Operating Systems',
    topics: [
      {
        id: 'os-processes',
        name: 'Processes & Threads',
        subtopics: [
          { id: 'proc-basics', name: 'Process Concepts & System Calls', status: 'not_started' },
          { id: 'proc-threads', name: 'Threads & Multithreading', status: 'not_started' },
          { id: 'proc-ipc', name: 'Inter-Process Communication', status: 'not_started' },
        ]
      },
      {
        id: 'os-scheduling',
        name: 'CPU Scheduling',
        subtopics: [
          { id: 'sched-algorithms', name: 'Scheduling Algorithms (FCFS, SJF, RR, Priority)', status: 'not_started' },
          { id: 'sched-io', name: 'I/O Scheduling', status: 'not_started' },
        ]
      },
      {
        id: 'os-synchronization',
        name: 'Concurrency & Synchronization',
        subtopics: [
          { id: 'sync-critical', name: 'Critical Section & Mutex', status: 'not_started' },
          { id: 'sync-semaphores', name: 'Semaphores', status: 'not_started' },
          { id: 'sync-deadlock', name: 'Deadlock (Prevention, Avoidance, Detection)', status: 'not_started' },
        ]
      },
      {
        id: 'os-memory',
        name: 'Memory Management',
        subtopics: [
          { id: 'mm-paging', name: 'Paging & Page Tables', status: 'not_started' },
          { id: 'mm-segmentation', name: 'Segmentation', status: 'not_started' },
          { id: 'mm-virtual', name: 'Virtual Memory & Page Replacement', status: 'not_started' },
        ]
      },
      {
        id: 'os-filesystem',
        name: 'File Systems',
        subtopics: [
          { id: 'fs-basics', name: 'File Organization & Access Methods', status: 'not_started' },
          { id: 'fs-allocation', name: 'Disk Allocation Methods', status: 'not_started' },
        ]
      }
    ]
  },
  {
    id: 'databases',
    name: 'Databases',
    topics: [
      {
        id: 'db-ermodel',
        name: 'ER Model',
        subtopics: [
          { id: 'er-basics', name: 'ER Diagrams & Entities', status: 'not_started' },
          { id: 'er-relationships', name: 'Relationships & Cardinality', status: 'not_started' },
        ]
      },
      {
        id: 'db-relational',
        name: 'Relational Model',
        subtopics: [
          { id: 'rel-algebra', name: 'Relational Algebra', status: 'not_started' },
          { id: 'rel-calculus', name: 'Tuple Relational Calculus', status: 'not_started' },
          { id: 'rel-sql', name: 'SQL (Queries, Joins, Subqueries)', status: 'not_started' },
        ]
      },
      {
        id: 'db-normalization',
        name: 'Normalization',
        subtopics: [
          { id: 'norm-fd', name: 'Functional Dependencies', status: 'not_started' },
          { id: 'norm-forms', name: 'Normal Forms (1NF, 2NF, 3NF, BCNF)', status: 'not_started' },
          { id: 'norm-decomposition', name: 'Decomposition & Lossless Joins', status: 'not_started' },
        ]
      },
      {
        id: 'db-indexing',
        name: 'File Organization & Indexing',
        subtopics: [
          { id: 'idx-btree', name: 'B-Trees & B+ Trees', status: 'not_started' },
          { id: 'idx-hashing', name: 'Hashing in Files', status: 'not_started' },
        ]
      },
      {
        id: 'db-transactions',
        name: 'Transactions & Concurrency Control',
        subtopics: [
          { id: 'txn-acid', name: 'ACID Properties', status: 'not_started' },
          { id: 'txn-serializability', name: 'Serializability', status: 'not_started' },
          { id: 'txn-locking', name: 'Locking Protocols', status: 'not_started' },
        ]
      }
    ]
  },
  {
    id: 'computer-networks',
    name: 'Computer Networks',
    topics: [
      {
        id: 'cn-layering',
        name: 'Network Layering',
        subtopics: [
          { id: 'layer-osi', name: 'OSI Model', status: 'not_started' },
          { id: 'layer-tcpip', name: 'TCP/IP Stack', status: 'not_started' },
          { id: 'layer-switching', name: 'Packet, Circuit & Virtual Circuit Switching', status: 'not_started' },
        ]
      },
      {
        id: 'cn-datalink',
        name: 'Data Link Layer',
        subtopics: [
          { id: 'dl-framing', name: 'Framing & Error Detection', status: 'not_started' },
          { id: 'dl-mac', name: 'MAC Protocols', status: 'not_started' },
          { id: 'dl-ethernet', name: 'Ethernet & Bridging', status: 'not_started' },
        ]
      },
      {
        id: 'cn-network',
        name: 'Network Layer',
        subtopics: [
          { id: 'net-routing', name: 'Routing Algorithms (Shortest Path, DV, LS)', status: 'not_started' },
          { id: 'net-ip', name: 'IP Addressing (IPv4, CIDR, Subnetting)', status: 'not_started' },
          { id: 'net-protocols', name: 'ARP, DHCP, ICMP, NAT', status: 'not_started' },
          { id: 'net-fragmentation', name: 'Fragmentation & Reassembly', status: 'not_started' },
        ]
      },
      {
        id: 'cn-transport',
        name: 'Transport Layer',
        subtopics: [
          { id: 'tr-udp', name: 'UDP', status: 'not_started' },
          { id: 'tr-tcp', name: 'TCP (Connection, Reliability)', status: 'not_started' },
          { id: 'tr-congestion', name: 'Flow & Congestion Control', status: 'not_started' },
          { id: 'tr-sockets', name: 'Sockets', status: 'not_started' },
        ]
      },
      {
        id: 'cn-application',
        name: 'Application Layer',
        subtopics: [
          { id: 'app-dns', name: 'DNS', status: 'not_started' },
          { id: 'app-http', name: 'HTTP & FTP', status: 'not_started' },
          { id: 'app-email', name: 'SMTP & Email Protocols', status: 'not_started' },
        ]
      }
    ]
  }
];

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.GATE_SYLLABUS = GATE_SYLLABUS;
}
