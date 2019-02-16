#!/bin/bash

UNIV=`bx seed | bx ec-new | bx ec-to-wif`
STUDENT=`bx seed | bx ec-new | bx ec-to-wif`
COMPANY=`bx seed | bx ec-new | bx ec-to-wif`

echo "university: ${UNIV}"
echo "student   : ${STUDENT}"
echo "company   : ${COMPANY}"

