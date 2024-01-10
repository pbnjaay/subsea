INSERT INTO User(email, username, password, salt, fullName, isAdmin)
VALUES (
    'papabassirou.ndiaye@orange-sonatel.com',
    'tmp_ndiaye67964',
    '50509f811951dcbe597171bb80c3674c4a0ee88fe4b3127df3b350ed0ee0c063',
    '539208e06a00294cc0327f796d9a5992',
    'Papa Bassirou Ndiaye',
    1
);


INSERT INTO Profile(avatarUrl, userId, updatedAt)
VALUES (
    'https://robohash.org/tmp_ndiaye67964.png',
    1,
    CURRENT_TIMESTAMP
    
);

