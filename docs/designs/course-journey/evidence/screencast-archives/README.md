# 原生切换画面帧归档

为使PR文件列表可审查，将切换过程中的JPEG帧无损归档；原始帧字节、尺寸和顺序未改变，本机原文件没有删除。普通截图、失败示例、原始记录和JSON汇总仍在各阶段目录。本文不增加验证次数，也不把失败采样变成通过。

每个ZIP内路径相对于上一级`evidence/`，与各场景`record.json`中的文件名对应。解压到上一级目录即可恢复原路径。人工直接引用的帧继续单独保存；校验每帧长度和SHA见[manifest.json](manifest.json)。ZIP校验已逐项解压比对原字节。

| 归档 | 字节 | SHA-256 |
| --- | --- | --- |
| [frames-01.zip](frames-01.zip) | 32,867,927 | `10ef1cdf365f2af768c1898edc35fd448008eb58470e995ce9e05bccf5630e13` |
| [frames-02.zip](frames-02.zip) | 32,847,254 | `84f701de2eb370b8e35e6180e9990f703c230df986139e4cb58c11f04670b751` |
| [frames-03.zip](frames-03.zip) | 32,810,959 | `b7400eb4406a534ac6bb76a71620e0a156bcc7b84bb5d167f0a9b2ca89a6dfe4` |
| [frames-04.zip](frames-04.zip) | 32,793,300 | `741359c7092662e709eee25c6b08ab0f0002cd5116ec6d456242be5a5a1a9496` |
| [frames-05.zip](frames-05.zip) | 32,864,448 | `853391840b614c766c48f00e821e72663cb7466cbb6be8c6fd38093311fa0d7a` |
| [frames-06.zip](frames-06.zip) | 32,895,491 | `713d1c574fe391d750ce604c80cf9a1862644d1f2147a7da9d9e8c60eefa0683` |
| [frames-07.zip](frames-07.zip) | 2,831,632 | `2a258e15475383108808aad00faf4d825ecdd3b04999d07fdd463b5b48340624` |
