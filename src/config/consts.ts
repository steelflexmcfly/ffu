export const LEAGUE_IDS = {
    PREMIER: {
        '2024': '1124841088360660992',
        '2023': '989237166217723904',
        '2022': '856271024054996992',
        '2021': '710961812656455680'
    },
    MASTERS: {
        '2024': '1124833010697379840',
        '2023': '989238596353794048',
        '2022': '856271401471029248'
    },
    NATIONAL: {
        '2024': '1124834889196134400',
        '2023': '989240797381951488',
        '2022': '856271753788403712',
        '2021': '726573082608775168'
    }
};

export const USER_IDS = {
    '331590801261883392': 'TheMurdockle',
    '396808818157182976': 'jvermeulen',
    '398574272387297280': 'Dmandre161',
    '398576262546735104': 'DaKoons86',
    '467404039059927040': 'holten45',
    '470715135581745152': 'Pressthecot',
    '705642514408886272': 'elliotbonus',
    '710981985102802944': 'GooberX',
    '727368657923063808': 'Haunter151',
    '729741648338210816': 'ChicagoPick6',
    '798327505219096576': 'DrTBlow05',
    '860973514839199744': 'ShowBizKitten',
    '862142522036703232': 'qu1nly',
    '84604928349585408': 'setorines',
    '398552306884345856': 'arcorey15',
    '578691097983754240': 'MustachePapi',
    '602712418325442560': 'KayleeConley',
    '804551335088361472': 'mitchreeves1887',
    '821067488811909120': 'LegendsRise',
    '856248808915480576': 'bobbylight4893',
    '864966364937461760': 'stupidjack13',
    '865078270985629696': 'DarkShadows124',
    '84006772809285632': 'JoshC94',
    '325766631336714240': 'Swaggyp017',
    '386791325690994688': 'Yensen',
    '462383465753473024': 'Hershy4',
    '465884883869233152': 'CamDelphia',
    '507633950666584064': 'DavrilOfKurth',
    '508719015656099840': 'Jamauro',
    '527884868880531456': 'ItsAllOgre',
    '726572095210930176': 'tylerhoroho',
    '731211092713402368': 'BaskinDobbins32',
    '639877229681147904': 'EWenke13',
    '664739261735591936': 'ekoester42',
    '715362669380591616': 'ZBoser',
    '727366898383122432': 'ZachPerk97',
    '865323291064291328': 'tylersanford',
    '1124071986805829632': 'Gthunder16',
    '1133491276038426624': 'ViagraPolice',
    '1133492104077946880': 'TheShaDynasty87',
    '399322397750124544': 'Jacamart',
    '472876832719368192': 'cjcolip',
    '399297882890440704': 'TCoolDaGoat',
    '467553389673181184': 'ExtremeSolution',
    '599711204499312640': 'Drixxlepix48',
    '739275676649144320': 'oliverhindman',
    '563223565497249792': 'bstarrr',
    '1003144735223099392': 'dewdoc',
    '726584695151734784': 'The_Ducklings',
    '729571025750208512': 'chetmaynard',
    '399379352174768128': 'dylanhallaback'
}

export interface UserIdInfoMap {
    [key: string]: {
        displayName: string,
        teamName: string,
        abbreviation: string,
        firstName: string,
        lastInitial: string
    }
}

export const USER_IDS_INFO_MAP: UserIdInfoMap = {
    '331590801261883392': {
        displayName: 'TheMurdockle',
        teamName: 'The Stallions',
        abbreviation: 'STA',
        firstName: 'Jonathan',
        lastInitial: 'M'
    },
    '396808818157182976': {
        displayName: 'jvermeulen',
        teamName: 'FFUcked Up',
        abbreviation: 'FU',
        firstName: 'Jake',
        lastInitial: 'V'
    },
    '398574272387297280': {
        displayName: 'Dmandre161',
        teamName: 'Dmandre161',
        abbreviation: 'DMAN',
        firstName: 'Derek',
        lastInitial: 'A'
    },
    '398576262546735104': {
        displayName: 'DaKoons86',
        teamName: 'Blood, Sweat, and Beers',
        abbreviation: 'BEER',
        firstName: 'Darien',
        lastInitial: 'K'
    },
    '467404039059927040': {
        displayName: 'holten45',
        teamName: 'Malibu Leopards',
        abbreviation: 'MLBU',
        firstName: 'Holten',
        lastInitial: 'W'
    },
    '470715135581745152': {
        displayName: 'Pressthecot',
        teamName: 'Pottsville Maroons',
        abbreviation: 'POTT',
        firstName: 'Andrew',
        lastInitial: 'P'
    },
    '705642514408886272': {
        displayName: 'elliotbonus',
        teamName: 'The Dark Knights',
        abbreviation: 'BATS',
        firstName: 'Elliot',
        lastInitial: 'B'
    },
    '710981985102802944': {
        displayName: 'GooberX',
        teamName: 'Frank\'s Little Beauties',
        abbreviation: 'FLB',
        firstName: 'Adam',
        lastInitial: 'M'
    },
    '727368657923063808': {
        displayName: 'Haunter151',
        teamName: 'Fort Wayne Banana Bread',
        abbreviation: 'FWBB',
        firstName: 'Kalvin',
        lastInitial: 'F'
    },
    '729741648338210816': {
        displayName: 'ChicagoPick6',
        teamName: 'ChicagoPick6',
        abbreviation: 'CP6',
        firstName: 'Andrew',
        lastInitial: 'F'
    },
    '798327505219096576': {
        displayName: 'DrTBlow05',
        teamName: 'TKO Blow',
        abbreviation: 'TKO',
        firstName: 'Torin',
        lastInitial: 'Blow'
    },
    '860973514839199744': {
        displayName: 'ShowBizKitten',
        teamName: 'Show Biz Kitten',
        abbreviation: 'SBK',
        firstName: 'Austin',
        lastInitial: 'M'
    },
    '862142522036703232': {
        displayName: 'qu1nly',
        teamName: 'Boca Ciega Banditos',
        abbreviation: 'BOCA',
        firstName: 'Quintin',
        lastInitial: 'K'
    },
    '84604928349585408': {
        displayName: 'setorines',
        teamName: 'The (Teddy) Bears',
        abbreviation: 'TTB',
        firstName: 'Seth',
        lastInitial: 'K'
    },
    '398552306884345856': {
        displayName: 'arcorey15',
        teamName: 'arcorey15',
        abbreviation: 'ARCO',
        firstName: 'Alan',
        lastInitial: 'C'
    },
    '578691097983754240': {
        displayName: 'MustachePapi',
        teamName: 'MustachePapi',
        abbreviation: 'MUST',
        firstName: '',
        lastInitial: ''
    },
    '602712418325442560': {
        displayName: 'KayleeConley',
        teamName: 'The Riveters',
        abbreviation: 'RVTR',
        firstName: 'Kaylee',
        lastInitial: 'C'
    },
    '804551335088361472': {
        displayName: 'mitchreeves1887',
        teamName: 'Crawfordsville\'s Finest',
        abbreviation: 'CRAW',
        firstName: 'Mitch',
        lastInitial: 'R'
    },
    '821067488811909120': {
        displayName: 'LegendsRise',
        teamName: 'LegendsRise',
        abbreviation: 'RISE',
        firstName: 'John',
        lastInitial: 'F'
    },
    '856248808915480576': {
        displayName: 'bobbylight4893',
        teamName: 'The Tooth Tuggers',
        abbreviation: 'TT',
        firstName: 'Bob',
        lastInitial: 'L'
    },
    '864966364937461760': {
        displayName: 'stupidjack13',
        teamName: 'Nighthawks',
        abbreviation: 'HAWK',
        firstName: 'Jack',
        lastInitial: 'A'
    },
    '865078270985629696': {
        displayName: 'DarkShadows124',
        teamName: 'The Gaston Ramblers',
        abbreviation: 'TGR',
        firstName: 'Ben',
        lastInitial: 'M'
    },
    '84006772809285632': {
        displayName: 'JoshC94',
        teamName: 'The Minutemen',
        abbreviation: 'MMEN',
        firstName: 'Josh',
        lastInitial: 'C'
    },
    '325766631336714240': {
        displayName: 'Swaggyp017',
        teamName: 'Act More Stupidly',
        abbreviation: 'AMS',
        firstName: 'Brandon',
        lastInitial: 'P'
    },
    '386791325690994688': {
        displayName: 'Yensen',
        teamName: 'Indianapolis Aztecs',
        abbreviation: 'AZTC',
        firstName: 'Jensen',
        lastInitial: 'K'
    },
    '462383465753473024': {
        displayName: 'Hershy4',
        teamName: 'Raging Rhinos',
        abbreviation: 'RAGE',
        firstName: 'Nathan',
        lastInitial: 'H'
    },
    '465884883869233152': {
        displayName: 'CamDelphia',
        teamName: 'CamDelphia',
        abbreviation: 'CAM',
        firstName: 'Cameron',
        lastInitial: 'D'
    },
    '507633950666584064': {
        displayName: 'DavrilOfKurth',
        teamName: 'El Guapo Puto',
        abbreviation: 'EGP',
        firstName: 'Zach',
        lastInitial: 'L'
    },
    '508719015656099840': {
        displayName: 'Jamauro',
        teamName: 'Team Pancake',
        abbreviation: 'TP',
        firstName: 'Marcus',
        lastInitial: 'H'
    },
    '527884868880531456': {
        displayName: 'ItsAllOgre',
        teamName: 'Johnkshire Cats',
        abbreviation: 'CATS',
        firstName: 'John',
        lastInitial: 'L'
    },
    '726572095210930176': {
        displayName: 'tylerhoroho',
        teamName: 'Team Dogecoin',
        abbreviation: 'DOGE',
        firstName: 'Tyler',
        lastInitial: 'H'
    },
    '731211092713402368': {
        displayName: 'BaskinDobbins32',
        teamName: 'Team Dogecoin',
        abbreviation: 'DOGE',
        firstName: 'Michael',
        lastInitial: 'G'
    },
    '639877229681147904': {
        displayName: 'EWenke13',
        teamName: 'He Hate Me',
        abbreviation: 'HATE',
        firstName: 'Eric',
        lastInitial: 'W'
    },
    '664739261735591936': {
        displayName: 'ekoester42',
        teamName: 'CENATION',
        abbreviation: 'CENA',
        firstName: 'Eric',
        lastInitial: 'K'
    },
    '715362669380591616': {
        displayName: 'ZBoser',
        teamName: 'ZBoser',
        abbreviation: 'ZBOS',
        firstName: 'Z',
        lastInitial: 'B'
    },
    '727366898383122432': {
        displayName: 'ZachPerk97',
        teamName: 'Big Ten Bandits ',
        abbreviation: 'B1G',
        firstName: 'Zach',
        lastInitial: 'P'
    },
    '865323291064291328': {
        displayName: 'tylersanford',
        teamName: 'Head Cow Always Grazing',
        abbreviation: 'HCAG',
        firstName: 'Tyler',
        lastInitial: 'S'
    },
    '1124071986805829632': {
        displayName: 'Gthunder16',
        teamName: 'Odin\'s Herr',
        abbreviation: 'ODIN',
        firstName: 'Seth',
        lastInitial: 'G'
    },
    '1133491276038426624': {
        displayName: 'ViagraPolice',
        teamName: 'Bucky Badgers',
        abbreviation: 'BDGR',
        firstName: 'Kyle',
        lastInitial: 'B'
    },
    '1133492104077946880': {
        displayName: 'TheShaDynasty87',
        teamName: 'The Sha\'Dynasty ',
        abbreviation: 'NSTY',
        firstName: 'Mark',
        lastInitial: 'L'
    },
    '399322397750124544': {
        displayName: 'Jacamart',
        teamName: 'Team Jacamart',
        abbreviation: 'JACA',
        firstName: 'Jacob',
        lastInitial: 'M'
    },
    '472876832719368192': {
        displayName: 'cjcolip',
        teamName: 'Stark Direwolves',
        abbreviation: 'STRK',
        firstName: 'Charlie',
        lastInitial: 'C'
    },
    '399297882890440704': {
        displayName: 'TCoolDaGoat',
        teamName: 'Circle City Phantoms',
        abbreviation: 'CCP',
        firstName: 'Tyler',
        lastInitial: 'C'
    },
    '467553389673181184': {
        displayName: 'ExtremeSolution',
        teamName: 'Shton\'s Strikers',
        abbreviation: 'SHTN',
        firstName: 'Ashton',
        lastInitial: 'F'
    },
    '599711204499312640': {
        displayName: 'Drixxlepix48',
        teamName: 'Drixxlepix48',
        abbreviation: 'DRIX',
        firstName: 'Drix',
        lastInitial: 'P'
    },
    '739275676649144320': {
        displayName: 'oliverhindman',
        teamName: 'Birds of War',
        abbreviation: 'BOW',
        firstName: 'Oliver',
        lastInitial: 'H'
    },
    '563223565497249792': {
        displayName: 'bstarrr',
        teamName: 'bstarrr',
        abbreviation: 'BSTA',
        firstName: 'B',
        lastInitial: 'S'
    },
    '1003144735223099392': {
        displayName: 'dewdoc',
        teamName: 'dewdoc',
        abbreviation: 'DEW',
        firstName: 'Emma',
        lastInitial: 'D'
    },
    '726584695151734784': {
        displayName: 'The_Ducklings',
        teamName: 'The Ducklings',
        abbreviation: 'DUCK',
        firstName: 'Will',
        lastInitial: 'M'
    },
    '729571025750208512': {
        displayName: 'chetmaynard',
        teamName: 'chetmaynard',
        abbreviation: 'CHET',
        firstName: 'Chet',
        lastInitial: 'M'
    },
    '399379352174768128': {
        displayName: 'dylanhallaback',
        teamName: 'Stone Cold Steve Irwins' ,
        abbreviation: 'SCSI',
        firstName: 'Dylan',
        lastInitial: 'H'
    }
}

// '399297882890440704': 'ChefBoyTCool ',